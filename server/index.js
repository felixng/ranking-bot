/* eslint consistent-return:0 */
require('newrelic');
const express = require('express');
const logger = require('./logger');

const argv = require('minimist')(process.argv.slice(2));
const setup = require('./middlewares/frontendMiddleware');
const isDev = process.env.NODE_ENV !== 'production';
const ngrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel ? require('ngrok') : false;
const resolve = require('path').resolve;
const app = express();

const counters = require('./bots/counters');

var passport = require('passport');
var Strategy = require('passport-http').BasicStrategy;
var db = require('./db');

passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));


// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);
app.post(':site/crawl/:daysAgo/:length', function(req, res) {
  if (req.params.site == 'train'){
    counters.trainCounter.gatherAllDuration(req.params.daysAgo, req.params.length);
  }

  if (req.params.site == 'westend'){
    counters.theatreCounter.gatherAllDuration(req.params.daysAgo, req.params.length);
  }
  
  res.status(200).send();
});

app.post('/:site/crawl/:daysAgo/:length', passport.authenticate('basic', { session: false }), function(req, res) {
  if (req.params.site == 'train'){
    counters.trainCounter.gatherAllDuration(req.params.daysAgo, req.params.length);
  }

  if (req.params.site == 'westend'){
    counters.theatreCounter.gatherAllDuration(req.params.daysAgo, req.params.length);
  }
  
  res.status(200).send();
});

app.post('/crawl/:daysAgo/:length', passport.authenticate('basic', { session: false }), function(req, res) {
  counters.trainCounter.gatherAllDuration(req.params.daysAgo, req.params.length);
  // counters.theatreCounter.gatherAllDuration(req.params.daysAgo, req.params.length);
  
  res.status(200).send();
});

app.get('/felix', passport.authenticate('basic', { session: false }), function(req, res) {
  res.status(200).send('Hello Felix! :)');
});

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

const port = argv.port || process.env.PORT || 3000;

// Start your app.
app.listen(port, host, (err) => {
  if (err) {
    return logger.error(err.message);
  }

  // Connect to ngrok in dev mode
  if (ngrok) {
    ngrok.connect(port, (innerErr, url) => {
      if (innerErr) {
        return logger.error(innerErr);
      }

      logger.appStarted(port, prettyHost, url);
    });
  } else {
    logger.appStarted(port, prettyHost);
  }
});

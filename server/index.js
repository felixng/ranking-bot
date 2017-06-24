/* eslint consistent-return:0 */
require('newrelic');
const express = require('express');
const logger = require('./logger');

const argv = require('minimist')(process.argv.slice(2));
const setup = require('./middlewares/frontendMiddleware');
const setupBackend = require('./middlewares/backendMiddleware');
const isDev = process.env.NODE_ENV !== 'production';
const ngrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel ? require('ngrok') : false;
const resolve = require('path').resolve;
const app = express();
const counters = require('./bots/counters');

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);
setupBackend(app);

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


//Bots
var CronJob = require('cron').CronJob;
// counters.theatreCounter.testDB();
new CronJob('00 00 01 * * 1', function() {
  counters.theatreCounter.gatherAllDuration(1, 7);
  counters.trainCounter.gatherAllDuration(1, 7);
}, null, true, 'Europe/London');

new CronJob('00 00 01 * * *', function() {
  counters.theatreCounter.gatherAll();
  counters.trainCounter.gatherAll();
}, null, true, 'Europe/London');

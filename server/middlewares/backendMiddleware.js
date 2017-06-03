var passport = require('passport');
var Strategy = require('passport-http').BasicStrategy;
var db = require('../db');

const addBackendMiddlewares = (app) => {
	passport.use(new Strategy(
	  function(username, password, cb) {
	    db.users.findByUsername(username, function(err, user) {
	      if (err) { return cb(err); }
	      if (!user) { return cb(null, false); }
	      if (user.password != password) { return cb(null, false); }
	      return cb(null, user);
	    });
	  }));

	const counters = require('../bots/counters');

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
	  next();
	});

	app.get('/felix', passport.authenticate('basic', { session: false }), function(req, res) {
	  res.send('Hello felix!');
	});

	app.get('/top10', function(req, res) {
	  res.send('Top10');
	});
}

module.exports = (app) => {
	addBackendMiddlewares(app);
};
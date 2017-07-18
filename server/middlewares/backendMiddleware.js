var passport = require('passport');
var Strategy = require('passport-http').BasicStrategy;
var db = require('../db');
var mongo = require('../bots/db/mongo');

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

	app.post('/crawl/:daysAgo/:length', passport.authenticate('basic', { session: false }), function(req, res) {
	  counters.theatreCounter.gatherAllDuration(req.params.daysAgo, req.params.length);
	  
	  res.status(200).send();
	});

	app.get('/top/:number/:date', function(req, res) {
	  	mongo.list(req.params.date, parseInt(req.params.number), function(list){
	  		res.json(list);	
	  	})
	});

	app.get('/snapshot/:handle/:date', function(req, res) {
	  	mongo.snapshot(req.params.date, req.params.handle, function(snapshot){
	  		res.json(snapshot);	
	  	})
	});

	
}

module.exports = (app) => {
	addBackendMiddlewares(app);
};
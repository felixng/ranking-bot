require('newrelic');
var TweetCounter = require('./tweetCounter.js');
var CronJob = require('cron').CronJob;
var debug = process.env.DEBUG;

var Twit = require('twit');
var redis = require('redis').createClient(process.env.REDIS_URL || "redis://h:pc8d86cd65c7102d817057135e85213ccdb2e7196eda9a558c96f7b53cbb0ad18@ec2-34-249-251-118.eu-west-1.compute.amazonaws.com:13119");
var westEndSheet = process.env.WESTEND_SHEET || 'id=1GsNXv7Na24WB5XzKCKlHl_72GLAxOrs9K_v2sYQ4eQ4&sheet=1';
var trainSheet = process.env.TRAIN_SHEET || 'id=1GsNXv7Na24WB5XzKCKlHl_72GLAxOrs9K_v2sYQ4eQ4&sheet=2';

var configPath = './config.js';
if (debug == null || !debug){
	configPath = './localconfig.js'
}

var T = new Twit(require(configPath));

var counter = new TweetCounter('', T, redis, westEndSheet);
var trainCounter = new TweetCounter('Train', T, redis, trainSheet);

new CronJob('00 00 01 * * 1', function() {
  counter.gatherAllDuration(1, 7);
  trainCounter.gatherAllDuration(1, 7);
}, null, true, 'Europe/London');

new CronJob('00 00 01 * * *', function() {
  counter.gatherAll();
  trainCounter.gatherAll();
}, null, true, 'Europe/London');

var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.status(200).send('West End League');
});

app.post(':site/crawl/:daysAgo/:length', function(req, res) {
	if (req.params.site == 'train'){
		trainCounter.gatherAllDuration(req.params.daysAgo, req.params.length);
	}

	if (req.params.site == 'westend'){
		counter.gatherAllDuration(req.params.daysAgo, req.params.length);
	}
	
	res.status(200).send();
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('West End League running on port ' + port + '.');
});
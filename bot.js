require('newrelic');
var TweetCounter = require('./tweetCounter.js');
var CronJob = require('cron').CronJob;
var debug = process.env.DEBUG;

var Twit = require('twit');
var redis = require('redis').createClient(process.env.REDIS_URL || "redis://h:p681205353c4df3fcd2ac99172b553019835bd15ea1a943fb759dc3c5ac344aa9@ec2-34-251-82-220.eu-west-1.compute.amazonaws.com:16849");
var westEndSheet = process.env.WESTEND_SHEET || 'id=1GsNXv7Na24WB5XzKCKlHl_72GLAxOrs9K_v2sYQ4eQ4&sheet=1';
var trainSheet = process.env.TRAIN_SHEET || 'id=1GsNXv7Na24WB5XzKCKlHl_72GLAxOrs9K_v2sYQ4eQ4&sheet=2';
var T = new Twit(require('./localconfig.js'));

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

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('West End League running on port ' + port + '.');
});
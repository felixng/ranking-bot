require('newrelic');
var TweetCounter = require('./tweetCounter.js');
var debug = false;

var Twit = require('twit');
var redis = require('redis').createClient(process.env.REDIS_URL || "redis://h:p681205353c4df3fcd2ac99172b553019835bd15ea1a943fb759dc3c5ac344aa9@ec2-34-251-82-220.eu-west-1.compute.amazonaws.com:16849");
var T = new Twit(require('./config.js'));
var counter = new TweetCounter(T, redis);
var query = process.env.USHER_QUERY || "#dayseat OR #dayseats -RT";

// Latest Tweets of query
var hastagSearch = { q: query, geocode: "51.528308,-0.3817765,500mi" ,count: 100, result_type: "recent", lang: 'en', result_type: 'recent' };
var stream = T.stream('user');
// stream.on('follow', followed);
// stream.on('tweet', tweetEvent);

function followed(event) {
    var name = event.source.name;
    var screenName = event.source.screen_name;
    var userId = event.source.id_str;
    var response = "Thanks for following us, " + name + " @" + screenName + " !"
    
    if (screenName != 'dayseaters'){
        // Post that tweet!
        T.post('statuses/update', { status: response }, tweeted);
        //T.post('friendships/create', { id: userId }, tweeted)

        console.log('We were followed by: ' + name + ' @' + screenName);    
    }
    
}

function tweetEvent(tweet) {
    // If we wanted to write a file out
    // to look more closely at the data
    // var fs = require('fs');
    // var json = JSON.stringify(tweet,null,2);
    // fs.writeFile("tweet.json", json, output);

    // Who is this in reply to?
    var reply_to = tweet.in_reply_to_screen_name;
    // Who sent the tweet?
    var name = tweet.user.screen_name;
    // What is the text?
    var txt = tweet.text;

    // Ok, if this was in reply to me
    // Replace selftwitterhandle with your own twitter handle
    // console.log(reply_to, name, txt);
    console.log(tweet);
    if (reply_to === 'selftwitterhandle') {

        // Get rid of the @ mention
        txt = txt.replace(/@selftwitterhandle/g, '');

        // Start a reply back to the sender
        //var reply = "Hi @" + name + ' ' + ', Thanks for the mention! :)';

        //console.log(reply);
        // Post that tweet!
        //T.post('statuses/update', { status: reply }, tweeted);
        //T.post('statuses/retweet/' + tweet.id, {}, tweeted)
    }
}

function retweetLatest() {
    T.get('search/tweets', hastagSearch, function(error, data) {
        var tweets = data.statuses;
        if (tweets){
            for (var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].text);
                console.log(tweets[i].user.id_str);
                
                // If our search request to the server had no errors...
                if (!error) {
                    // ...then we grab the ID of the tweet we want to retweet...
                    var retweetId = data.statuses[i].id_str;
                    var userId = data.statuses[i].user.id_str;

                    // ...and then we tell Twitter we want to retweet it!
                    T.post('statuses/retweet/' + retweetId, {}, tweeted)
                    //T.post('favorites/create', { id: retweetId }, tweeted)
                    //T.post('friendships/create', { id: userId }, tweeted)
                }
                // However, if our original search request had an error, we want to print it out here.
                else {
                    if (debug) {
                        console.log('There was an error with your hashtag search:', error);
                    }
                }
            }    
        }
        
    });
}

function tweeted(err, reply) {
    if (err !== undefined) {
        console.log(err);
    } else {
        console.log('Tweeted: ' + reply);
    }
};


// retweetLatest();
// setInterval(retweetLatest, 1000 * 60 * 12);1
counter.gatherAll();

var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.status(200).send('I dream of being a website.. please follow us on https://twitter.com/dayseaters or DM us to join.');
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('Digital Usher running on port ' + port + '.');
});
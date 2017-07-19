function TweetCounter(name ,T, redis, tableName) {
    const ignore = ['E_N_O', 'enballet', 'The_Globe', 'sadlers_wells', 'MenChocFactory', 'OpenAirTheatre', 'youngvictheatre', 'LyricHammer', 'NationalTheatre', ''];
    var fs = require('fs');
    var http = require("http");
    var sleep = require('sleep');
    var mongo = require('./db/mongo');

    const isDev = process.env.NODE_ENV !== 'production';
    const url = process.env.API_URL || 'uat-cms-ensemblr.herokuapp.com';

    var includeRetweet = process.env.INCLUDE_RETWEET || true;
    var retweetWeight = process.env.RETWEET_WEIGHT || 0.3;
    var favWeight = process.env.FAV_WEIGHT || 0.1;

    if (isDev){
        fs.unlink("tweet.json", function(){
            console.log("Cleaning up disk tweet file.")
        });
    };

    function toDateKey(date){
        return date.toJSON().slice(0,10).replace(/-/g,'-');
    }

    //Parsing Dates: Yesterday and the Day Before
    function parseDateQuery(daysAgo = 1, length = 1, callback){
        var date = new Date();
        date.setDate(date.getDate() - daysAgo);
        var untilDate = date.toJSON().slice(0,10).replace(/-/g,'-');
        console.log("Until: " + untilDate);

        date.setDate(date.getDate() - length);
        var sinceDate = date.toJSON().slice(0,10).replace(/-/g,'-');
        console.log("Since: " + sinceDate);

        var since = " since:" + sinceDate;
        var until = " until:" + untilDate;

        var dateOptions = {
            daysAgo: daysAgo,
            length: length,
            query: since + until
        }

        callback(dateOptions);
    }

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    function resetCounts(){
        console.log('Resetting Count');
        tweetTotal = 0;
        retweetTotal = 0;
        score = 0;
    }

    function parseResult(logConfig, tally, callback){
        var handle = logConfig.handle;
        // var daysAgo = logConfig.daysAgo;
        // var duration = logConfig.duration;
        var tweetTotal = tally.tweetTotal;
        var retweetTotal = tally.retweetTotal;
        var favTotal = tally.favTotal;
        var score = Math.round(tweetTotal + (retweetTotal * retweetWeight) + (favTotal * favWeight));

        var keyDate = new Date();
        // keyDate.setDate(keyDate.getDate() - daysAgo);
        keyDate.setDate(keyDate.getDate() - tally.daysAgo);
        var keyDateString = keyDate.toJSON().slice(0,10).replace(/-/g,'-');

        var result = {
            id: logConfig.id,
            date: keyDateString,
            handle: logConfig.handle,
            tweetTotal: tweetTotal,
            retweetTotal: retweetTotal,
            favouriteTotal: favTotal,
            score: score,
            tweets: tally.tweetIds,
            createdAt: new Date(), 
        }

        callback(result);
    }

    function logToMongo(result){
        mongo.insert(result);
    }

    function getJSON(options, onResult)
    {
        console.log("rest::getJSON");

        var port = options.port == 443 ? https : http;
        var req = port.request(options, function(res)
        {
            var output = '';
            //console.log(options.host + ':' + res.statusCode);
            res.setEncoding('utf8');

            res.on('data', function (chunk) {
                output += chunk;
            });

            res.on('end', function() {
                var obj = JSON.parse(output);
                onResult(res.statusCode, obj);
            });
        });

        req.on('error', function(err) {
            console.log(err);
        });

        req.end();
    };

    function logToFile(data){
        if (isDev){
            var json = JSON.stringify(data,null,2);
            
            fs.appendFile("tweet.json", json, function(){
                console.log("Twitter reply wrote to disk.")
            });
        }
    }

    function calculateTweets(tweets, tally) {
        if (tweets.statuses){
            tally.tweetTotal += tweets.statuses.length;

            tweets.statuses.forEach( (tweet) => {
                tally.retweetTotal += tweet.retweet_count;
                tally.favTotal += tweet.favorite_count;
                tally.tweetIds.push(tweet.id_str);
            });
        }
    };

    function getProductionsFromAPI(callback){
        var options = {
          hostname: url,
          path: '/api/productions/twitters',
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        };

        getJSON(options, function(status, result) {
            callback(result);
        });
    }

    var getTweetChunk = function myself (tally, max_id) {
        return new Promise( (resolve, reject) => {
            var nextSearch = tally.query;
            if (max_id){
                nextSearch.max_id = max_id;
            }

            T.get('search/tweets', nextSearch, function(error, data) {
                if (error){
                    // console.log(error);
                    if (error.twitterReply){
                        console.log(error.twitterReply.errors);    
                    }
                    sleep.sleep(900);
                }
                else if (data.errors){
                    // console.log(data.errors);
                    if (data.errors.twitterReply){
                        console.log(data.errors.twitterReply.errors);    
                    }
                    sleep.sleep(900);
                }
                else {
                    logToFile(data);
                    calculateTweets(data, tally);
                    resolve(data);
                }
            })
        })
        .then( data => {
            if ( data.statuses && data.statuses.length > 98) {
                return myself(tally, data.statuses[data.statuses.length - 1].id);
            }
        });
    };

    function run(production, dateOptions){
        var date = dateOptions.query;
        var handle = production.handle;
        var tweetTotal = 0;
        var favTotal = 0;
        var retweetTotal = 0;
        var query = { q: handle + date + ' -filter:retweets',
                       geocode: "51.528308,-0.3817765,500mi", 
                       count: 99,
                       result_type: "recent", 
                       lang: 'en', 
                       include_entities: false,
                       result_type: 'recent' };
        
        var logConfig = {
            id: production.id,
            handle: handle, 
        }

        var tally = {
            query: query,
            tweetTotal: tweetTotal,
            retweetTotal: retweetTotal,
            favTotal: favTotal,
            daysAgo: dateOptions.daysAgo,
            length: dateOptions.length,
            tweetIds: [],
        }

        return new Promise( (resolve, reject) => {
            var promise = getTweetChunk(tally, null);

            Promise.all([promise]).then(values => { 
              resolve();
            });
        })
        .then(function(){
            parseResult(logConfig, tally, function(result){
                logToMongo(result);
            });
            resetCounts();
        })
    };

    this.gatherAll = function(){
        this.gatherAllDuration(1, 1);
    }

    this.gatherAllDuration = function(daysAgo, duration){
        parseDateQuery(daysAgo, duration, function(dateOptions){
            getProductionsFromAPI(function(productions){
                // productions = productions.slice(7, 18);                
                productions.forEach(function(production){
                    if (!ignore.includes(production.handle) && production.handle != null){
                        run(production, dateOptions);
                    }
                    else{
                        console.log("Ignoring ", production.handle);
                    }
                });
            });    
        });
    }
}

module.exports = TweetCounter;
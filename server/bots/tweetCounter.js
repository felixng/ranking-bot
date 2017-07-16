function TweetCounter(name ,T, redis, tableName) {
    const ignore = ['E_N_O', 'enballet', 'The_Globe', 'sadlers_wells', 'MenChocFactory', 'OpenAirTheatre'];
    var fs = require('fs');
    var http = require("http");
    var sleep = require('sleep');
    var mongo = require('./db/mongo');

    const isDev = process.env.NODE_ENV !== 'production';
    const url = process.env.API_URL || 'uat-cms-ensemblr.herokuapp.com';

    var includeRetweet = process.env.INCLUDE_RETWEET || true;
    var retweetWeight = process.env.RETWEET_WEIGHT || 0.3;

    if (isDev){
        fs.unlink("tweet.json", function(){
            console.log("Cleaning up disk tweet file.")
        });
    };

    function toDateKey(date){
        return date.toJSON().slice(0,10).replace(/-/g,'-');
    }

    //Parsing Dates: Yesterday and the Day Before
    function parseDateQuery(daysAgo = 1, length = 1){
        var date = new Date();
        date.setDate(date.getDate() - daysAgo);
        var untilDate = date.toJSON().slice(0,10).replace(/-/g,'-');
        console.log("Until: " + untilDate);

        date.setDate(date.getDate() - length);
        var sinceDate = date.toJSON().slice(0,10).replace(/-/g,'-');
        console.log("Since: " + sinceDate);

        // Parsing Query
        // var query = process.env.RANKING_QUERY || "@HPPlayLDN";
        var since = " since:" + sinceDate;
        var until = " until:" + untilDate;

        return since + until;
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
        var daysAgo = logConfig.daysAgo;
        var duration = logConfig.duration;
        var tweetTotal = tally.tweetTotal;
        var retweetTotal = tally.retweetTotal;
        var score = Math.round(tweetTotal + (retweetTotal * retweetWeight));

        var keyDate = new Date();
        keyDate.setDate(keyDate.getDate() - daysAgo);
        var keyDateString = keyDate.toJSON().slice(0,10).replace(/-/g,'-');

        var result = {
            id: logConfig.id,
            date: keyDateString,
            handle: logConfig.handle,
            tweetTotal: tweetTotal,
            retweetTotal: retweetTotal,
            score: score,
            createdAt: new Date(), 
        }

        callback(result);
    }

    function logToMongo(result){
        console.log("Logging to Mongo");
        mongo.insert(result);
    }

    // function logToRedis(logConfig, tally){
    //     console.log("Logging to Redis");
    //     var handle = logConfig.handle;
    //     var daysAgo = logConfig.daysAgo;
    //     var duration = logConfig.duration;
    //     var tweetTotal = tally.tweetTotal;
    //     var retweetTotal = tally.retweetTotal;

    //     var score = Math.round(tweetTotal + (retweetTotal * retweetWeight));

    //     console.log(handle);        
    //     console.log('tweetTotal:', tweetTotal);
    //     console.log('retweetTotal:', retweetTotal);            
    //     console.log('score:', score);

    //     var freq = 'daily';
    //     if (duration == 7){
    //         freq = 'weekly';
    //     }

        // var today = new Date();
        // var keyDate = new Date();
        // keyDate.setDate(keyDate.getDate() - daysAgo);
        // var keyDateString = keyDate.toJSON().slice(0,10).replace(/-/g,'-');

    //     var key = []
    //     if (name != ''){
    //         key = [ name, freq, keyDateString, handle ];
    //     }
    //     else {
    //         key = [ freq, keyDateString, handle ]
    //     }

    //     redis.hmset( key.join(':'),
    //                 {
    //                     'id': id,
    //                     'tweetTotal': tweetTotal, 
    //                     'retweetTotal': retweetTotal, 
    //                     'retweetWeight': retweetWeight, 
    //                     'createdAt': new Date(), 
    //                     'score': score, 
    //                 },
    //         function(err, reply) {
    //           console.log(reply);
    //         }
    //     );
    // }

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

    function getTweetChunk(logConfig, tally, query, max_id) {
        return new Promise( (resolve, reject) => {
            var nextSearch = query;
            nextSearch.max_id = max_id;

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
                return getTweetChunk(logConfig, tally, query, data.statuses[data.statuses.length - 1].id);
            }
        });
    };

    function scanAndSort(date = '*', freq = 'daily') {
        var searchKey = [ name, freq, date, '*' ]

        return new Promise((resolve, reject) => {
            redis.keys( searchKey.join(':'), function (err, all_keys) {
                var items = [];

                if (all_keys.length == 0){
                    resolve([]);
                }

                all_keys.forEach(function (key, pos) { // use second arg of forEach to get pos
                    redis.hgetall(key, function (err, item) {
                        item.key = key;
                        var parts = key.split(':');
                        item.handle = parts[parts.length - 1];
                        items.push(item);

                        if (pos == all_keys.length - 1){
                            resolve(items);
                        }
                    });
                })
            })
        })
        .then( items => {
            items.sort(statCompareDesc);
            return items.slice(0, 10);
        })
    }

    function run(production, daysAgo, duration){
        var handle = production.handle;
        var dateQuery = parseDateQuery(daysAgo, duration);
        var tweetTotal = 0;
        var retweetTotal = 0;

        var query = { q: handle + dateQuery,
                       geocode: "51.528308,-0.3817765,500mi", 
                       count: 99,
                       result_type: "recent", 
                       lang: 'en', 
                       include_entities: false,
                       result_type: 'recent' };
        
        var logConfig = {
            id: production.id,
            handle: handle, 
            daysAgo: daysAgo,
            duration: duration,
        }

        var tally = {
            tweetTotal: tweetTotal,
            retweetTotal: retweetTotal,
        }

        return new Promise( (resolve, reject) => {
            T.get('search/tweets', query, function(error, data) {
                console.log("Query: " + handle);
                
                if (error){
                    if (error.twitterReply){
                        console.log(error.twitterReply.errors);    
                    }
                    sleep.sleep(900);
                }
                else if (data.errors){
                    if (data.errors.twitterReply){
                        console.log(data.errors.twitterReply.errors);    
                    }
                    sleep.sleep(900);
                }
                else {
                    logToFile(data);
                    if (data.statuses && data.statuses.length > 0){
                        calculateTweets(data, tally);
                        var promise = getTweetChunk(logConfig, tally, query, data.statuses[data.statuses.length - 1].id);

                        Promise.all([promise]).then(values => { 
                          resolve();
                        });
                    }
                }
            })
            .catch(function (err) {
                console.log('caught error', err.stack)
            })
        })
        .then(function(){
            parseResult(logConfig, tally, function(result){
                logToMongo(result);
            });
            resetCounts();
        })
    };

    function newRun(production, daysAgo, duration){
        var handle = production.handle;
        var dateQuery = parseDateQuery(daysAgo, duration);
        var tweetTotal = 0;
        var retweetTotal = 0;

        var query = { q: handle + dateQuery,
                       geocode: "51.528308,-0.3817765,500mi", 
                       count: 99,
                       result_type: "recent", 
                       lang: 'en', 
                       include_entities: false,
                       result_type: 'recent' };
        
        var logConfig = {
            id: production.id,
            handle: handle, 
            daysAgo: daysAgo,
            duration: duration,
        }

        var tally = {
            tweetTotal: tweetTotal,
            retweetTotal: retweetTotal,
        }


        T.get('search/tweets', query, function(error, data) {
                console.log("Query: " + handle);
                
                if (error){
                    if (error.twitterReply){
                        console.log(error.twitterReply.errors);    
                    }
                    sleep.sleep(900);
                }
                else if (data.errors){
                    if (data.errors.twitterReply){
                        console.log(data.errors.twitterReply.errors);    
                    }
                    sleep.sleep(900);
                }
                else {
                    logToFile(data);
                    if (data.statuses && data.statuses.length > 0){
                        calculateTweets(data, tally);
                        var promise = getTweetChunk(logConfig, tally, query, data.statuses[data.statuses.length - 1].id);

                        Promise.all([promise]).then(values => { 
                          resolve();
                        });
                    }
                }
        }).catch(function (err) {
            console.log('caught error', err.stack)
        })


        return new Promise( (resolve, reject) => {
            
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

    this.getTop10 = function(date){
        var scanPromise = scanAndSort(date);

        return scanPromise;
    }

    this.gatherAllDuration = function(daysAgo, duration){
        getProductionsFromAPI(function(productions){
            // console.log(productions);
            productions = productions.slice(0, 5);
            productions.forEach(function(production){
                newRun(production, daysAgo, duration);
            });
        });
    }

    function statCompareDesc(a,b) {
      return b.score - a.score
    }
}

module.exports = TweetCounter;
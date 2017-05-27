function TweetCounter(name ,T, redis, googleQuery) {
    var fs = require('fs');
    var http = require("http");
    var sleep = require('sleep');

    var debug = process.env.DEBUG || true;
    var includeRetweet = process.env.INCLUDE_RETWEET || true;
    var retweetWeight = process.env.RETWEET_WEIGHT || 0.3;

    if (debug){
        fs.unlink("tweet.json", function(){
            console.log("Cleaning up disk tweet file.")
        });
    };

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

    function logToRedis(logConfig, tally){
        var handle = logConfig.handle;
        var daysAgo = logConfig.daysAgo;
        var duration = logConfig.duration;
        var tweetTotal = tally.tweetTotal;
        var retweetTotal = tally.retweetTotal;

        var score = Math.round(tweetTotal + (retweetTotal * retweetWeight));

        console.log(handle);        
        console.log('tweetTotal:', tweetTotal);
        console.log('retweetTotal:', retweetTotal);            
        console.log('score:', score);

        var freq = 'daily';
        if (duration == 7){
            freq = 'weekly';
        }

        var today = new Date();
        var keyDate = new Date();
        keyDate.setDate(keyDate.getDate() - daysAgo);
        var keyDateString = keyDate.toJSON().slice(0,10).replace(/-/g,'-');

        var key = []
        if (name != ''){
            key = [ name, freq, keyDateString, handle ];
        }
        else {
            key = [ freq, keyDateString, handle ]
        }
        

        redis.hmset( key.join(':'),
                    {
                        'tweetTotal': tweetTotal, 
                        'retweetTotal': retweetTotal, 
                        'retweetWeight': retweetWeight, 
                        'createdAt': new Date(), 
                        'score': score, 
                    },
            function(err, reply) {
              console.log(reply);
            }
        );

        // tweetTotal = 0;
        // retweetTotal = 0;
        // score = 0;
    }

    function getJSON(options, onResult)
    {
        console.log("rest::getJSON");

        var prot = options.port == 443 ? https : http;
        var req = prot.request(options, function(res)
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
            //res.send('error: ' + err.message);
        });

        req.end();
    };

    function logToFile(data){
        if (debug){
            var json = JSON.stringify(data,null,2);
            //fs.appendFile("tweet.json", json, function(){});    
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

    function getHandles(callback){
        var options = {
          hostname: 'gsx2json.com',
          path: '/api?' + googleQuery,
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        };

        var handles = []

        console.log(options.path);

        getJSON(options, function(status, result) {
            if (result && result.rows && result.rows.length > 0){
                var rows = result.rows;
                
                for (var i = 0; i < rows.length; i++){
                    if (rows[i].tocrawl &&
                        rows[i].twitter && 
                        rows[i].twitter != '' &&
                        rows[i].twitter != '-') {
                        
                        if (!rows[i].twitter.startsWith('#')){
                            rows[i].twitter = '@' + rows[i].twitter;
                        }

                        handles.push(rows[i].twitter);
                    }
                }
            }

            callback(handles);
        });
    }

    function getTweetChunk(logConfig, tally, query, max_id) {
        return new Promise( (resolve, reject) => {
            var nextSearch = query;
            nextSearch.max_id = max_id;

            T.get('search/tweets', nextSearch, function(error, data) {
                if (error){
                    console.log(error);
                    sleep.sleep(900);
                }
                else if (data.errors){
                    console.log(data.errors);
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

    function run(handle, daysAgo, duration){
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
                    console.log(error);
                    sleep.sleep(900);
                }
                else if (data.errors){
                    console.log(data.errors);
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
            logToRedis(logConfig, tally);
            resetCounts();
        })
    };

    this.gatherAll = function(){
        this.gatherAllDuration(1, 1);
    }

    this.gatherAllDuration = function(daysAgo, duration){
        getHandles(function(handles){
            handles.forEach(function(handle){
                run(handle, daysAgo, duration);
            });
        });
    }
}

module.exports = TweetCounter;
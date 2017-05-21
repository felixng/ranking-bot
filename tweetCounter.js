function TweetCounter(T, redis) {
    var fs = require('fs');
    var http = require("http");
    var sleep = require('sleep');

    var debug = process.env.DEBUG || true;
    var includeRetweet = process.env.INCLUDE_RETWEET || true;
    var retweetWeight = process.env.RETWEET_WEIGHT || 0.3;
    var googleQuery = process.env.GOOGLESHEET_QUERY || 'id=1GsNXv7Na24WB5XzKCKlHl_72GLAxOrs9K_v2sYQ4eQ4&sheet=1';

    var tweetTotal = 0;
    var retweetTotal = 0;

    //Parsing Dates: Yesterday and the Day Before

    function parseDateQuery(daysAgo = 1, duration = 1){
        var date = new Date();
        date.setDate(date.getDate() - daysAgo);
        var untilDate = date.toJSON().slice(0,10).replace(/-/g,'-');
        console.log("Until: " + untilDate);

        date.setDate(date.getDate() - duration);
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
    
    function logToRedis(handle, daysAgo, duration){
        var score = Math.round(tweetTotal + (retweetTotal * retweetWeight));

        console.log(handle);        
        console.log('tweetTotal:', tweetTotal);
        console.log('retweetTotal:', retweetTotal);            
        console.log('score:', score);

        var freq = 'daily';
        if (duration == 7){
            freq = 'weekly';
        }

        var key = [ freq, yesterday, handle ]

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

        tweetTotal = 0;
        retweetTotal = 0;
        score = 0;
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
            fs.writeFile("tweet.json", json, function(){});    
        }
    }


    function calculateTweets(tweets) {
        if (tweets.statuses){
            tweetTotal += tweets.statuses.length;

            tweets.statuses.forEach( (tweet) => {
                retweetTotal += tweet.retweet_count;
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
                var productions = result.rows;
                
                for (var i = 0; i < productions.length; i++){
                    if (productions[i].tocrawl &&
                        productions[i].twitter && 
                        productions[i].twitter != '' &&
                        productions[i].twitter != '-') {
                        
                        if (!productions[i].twitter.startsWith('#')){
                            productions[i].twitter = '@' + productions[i].twitter;
                        }

                        handles.push(productions[i].twitter);
                    }
                }
            }

            callback(handles);
        });
    }

    function getTweetChunk(query, max_id) {
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
                    calculateTweets(data);
                    resolve(data);
                }
            });
        })
        .then( data => {
            if ( data.statuses && data.statuses.length > 98) {
                return getTweetChunk(query, data.statuses[data.statuses.length - 1].id);
            }
        });
    };

    function gather(handle, daysAgo, duration){
        var dateQuery = parseDateQuery(daysAgo, duration);

        var query = { q: handle + dateQuery,
                       geocode: "51.528308,-0.3817765,500mi", 
                       count: 99,
                       result_type: "recent", 
                       lang: 'en', 
                       include_entities: false,
                       result_type: 'recent' };

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
                    calculateTweets(data);
                    getTweetChunk(query, data.statuses[data.statuses.length - 1].id);
                }
                
                logToRedis(handle, daysAgo, duration);
            }
        });
    };

    this.gather = function(handle, daysAgo, duration){
        gather(handle, daysAgo, duration);
    }

    this.gatherAll = function(){
        getHandles(function(handles){
            handles.forEach(gather);
        });
    }

    this.gatherAllDuration = function(daysAgo, duration){
        getHandles(function(handles){
            handles.forEach(function(handle){
                gather(handle, daysAgo, duration)
            });
        });
    }
}

module.exports = TweetCounter;
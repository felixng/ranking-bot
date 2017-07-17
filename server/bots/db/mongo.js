var MongoClient = require('mongodb').MongoClient;

var url = process.env.MONGODB_URI || 'mongodb://localhost:27017/theatreTweets';
const collectionName = 'tweetCounts';

var insert = function(result){
	MongoClient.connect(url, function(err, db) {
	  console.log("Connected correctly to server");
	  var collection = db.collection(collectionName);

	  collection.updateOne({ id : result.id, handle: result.handle, date: result.date }, 
	  					   { $set: result }, 
	  					   { upsert: true }, function(err, result) {
	  	if (err) console.log(err)
	  	else{
	  		console.log("Inserted into the document collection");	
	  	}	

	  });
	});
}

var list = function(date, numberOfItems, callback){
	MongoClient.connect(url, function(err, db) {
	  console.log("Connected correctly to server");
	  var collection = db.collection(collectionName);

	  collection.find({ date: date })
  				.sort( { score: -1 } )
  				.limit(numberOfItems)
  				.toArray(function(err, result) {
	  	if (err) console.log(err)
	  	else{
	  		callback(result);
	  	}	
	  });
	});
}

var tweets = function(date, handle, callback){
	MongoClient.connect(url, function(err, db) {
	  console.log("Connected correctly to server");
	  var collection = db.collection(collectionName);

	  collection.find({ date: date, handle: handle })
  				.limit(1)
  				.toArray(function(err, result) {
	  	if (err) console.log(err)
	  	else{
	  		callback(result[0].tweets);
	  	}	
	  });
	});
}

module.exports = {
	insert: insert,
	list: list,
	tweets: tweets,
};
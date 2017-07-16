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
	    // callback(result);
	  });
	});
}

// var findAllDocuments = function(collectionName, db, callback) {
//   var collection = db.collection(collectionName);
//   // Find some documents
//   collection.find('twitter'::{$exists:true}).toArray(function(err, docs) {
//   	console.log("============Found the following handles=============");
  	
//     console.dir(docs);
//     //callback(docs);
//   });
// }


module.exports = {
	insert: insert,
};
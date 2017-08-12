export default function toKey(date) {
  var key = new Date(date)
  
  if (key.toJSON()){
  	return key.toJSON().slice(0,10).replace(/-/g,'-');	
  }
  
  console.log('key.toJSON() is null, returning key: ', key);
  return key;
}

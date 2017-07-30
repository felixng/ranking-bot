export default function toKey(date) {
  var key = new Date(date)
  return key.toJSON().slice(0,10).replace(/-/g,'-');
}

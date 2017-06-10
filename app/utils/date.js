export default function toKey(date) {
  return date.toJSON().slice(0,10).replace(/-/g,'-');
}
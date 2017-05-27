var password = process.env.ADMIN_PASSWORD || 'admin';

var records = [
    { id: 1, username: 'admin', password: password, displayName: 'Jack', emails: [ { value: 'hello@ensemblr.co' } ] }
];

exports.findByUsername = function(username, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
}

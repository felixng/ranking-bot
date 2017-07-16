const pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://tester:testing123@leagueconfig.c2brtd72dz8q.eu-west-2.rds.amazonaws.com:5432/TestConfig';
const client = new pg.Client(connectionString);

function getHandlesFromDB(callback){
    const results = [];
      
      pg.connect(connectionString, (err, client, done) => {
        console.log('Connecting to PG');

        if (err) {
          console.log(err);
          return;
        }
        
        const query = client.query('SELECT "Twitter" FROM "' + tableName + '" WHERE "Twitter" != \'\' and "Twitter" != \'-\';');
        console.log(query);
        query.on('row', (row) => {
            if (!row.Twitter.startsWith('#')){
                row.Twitter = '@' + row.Twitter;    
            }
            results.push(row.Twitter);
        });
        
        query.on('end', () => {
          callback(results);
        });
      });
}

module.expot = {
  getHandlesFromDB: getHandlesFromDB
}
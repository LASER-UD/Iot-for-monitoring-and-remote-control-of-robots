const db = require('mongoose');

db.Promise = global.Promise;// implement promise for return database

async function connect() {
  await db.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  console.log('[db] DB is connected');
}

module.exports = connect;
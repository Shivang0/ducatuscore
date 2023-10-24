const host = process.env.DWS_DB_HOST || 'localhost';
const port = process.env.DWS_DB_PORT || '27017';
const dbname = 'dws_test';
var config = {
  mongoDb: {
    uri: `mongodb://${host}:${port}/${dbname}`,
    dbname,
  },
};

module.exports = config;

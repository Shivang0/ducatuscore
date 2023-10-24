const host = process.env.DWC_DB_HOST || 'localhost';
const port = process.env.DWC_DB_PORT || '27017';
const dbname = 'dwc_test';
var config = {
  mongoDb: {
    uri: `mongodb://${host}:${port}/${dbname}`,
    dbname,
  },
};
 
module.exports = config;

var service = require('./service');
var Promise = require('bluebird');
var mongo = require('mongodb').MongoClient;
mongo.connect('mongodb://localhost:27017/crawler', {promiseLibrary: Promise})
.then(function(db) {
  console.log('数据库连接成功');
  module.exports = db;
  service.start();
}).catch(function(err) {
  if(err.name === 'MongoError' && err.message === 'connect ECONNREFUSED 127.0.0.1:27017') {
    console.log('数据库连接失败', err);
    process.exit(0);
  } else {
    console.error(err.stack);
    process.exit(1);
  }
})

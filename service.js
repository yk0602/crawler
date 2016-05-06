var Promise = require('bluebird');
var request = require('request');
Promise.promisifyAll(request);
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

var urls = (function() {
  var urlArr = [];
  for(var i = 1; i < 426; i++) {
    urlArr.push('https://cnodejs.org/?tab=all&page=' + i)
  }
  return urlArr;
})();

function getSinglePage(url, db) {
  return request.getAsync(url)
  .then(function(res) {
    if(res.statusCode === 200) {
      console.log('请求 ' + url + ' 成功')
      var $ = cheerio.load(res.body);
      $('#topic_list .topic_title').each(function (idx, element) {
        var $element = $(element);
        getContent('https://cnodejs.org' + $element.attr('href'))
        .then(function(content) {
          db.collection('article').insertOne({tilte: $element.attr('title'), href: 'https://cnodejs.org' + $element.attr('href'), content: content})
          .catch(function(err) {
            console.log('写数据库异常', err);
          });
        })
      });
   } else {
     console.log('请求 ' + url + ' 失败')
     getSinglePage(url);
   }
 }).catch(function(err) {
   console.log('请求 ' + url + ' 失败');
   getSinglePage(url);
 });
}

function getContent(url) {
  return request.getAsync({url: url, encoding: null})
  .then(function(res) {
    if(res.statusCode === 200) {
      console.log('请求 ' + url + ' ' + res.statusCode);
      var $ = cheerio.load(res.body);
      var content = $('#content .markdown-text').text();
      return content;
    } else {
      console.log('请求 ' + url + ' ' + res.statusCode);
      return getContent(url);
    }
  }).catch(function(err) {
    console.log('请求 ' + url + ' 失败');
    return getContent(url);
  });
}

function start() {
  var db = require('./index')
  Promise.map(urls, function(url) {
    return getSinglePage(url, db)
  }, {concurrency: 10})
  .then(function() {
    console.log('抓取完毕')
    process.exit(0);
  });
}

module.exports = {
  start: start,
  getContent: getContent
}



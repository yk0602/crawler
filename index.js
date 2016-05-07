var Promise = require('bluebird');
var request = require('request');
Promise.promisifyAll(request);
var cheerio = require('cheerio');
var Article = require('./db');

var urls = (function() {
  var urlArr = [];
  for(var i = 1; i < 427; i++) {
    urlArr.push('https://cnodejs.org/?tab=all&page=' + i)
  }
  return urlArr;
})();

function getSinglePage(url) {
  return request.getAsync(url)
  .then(function(res) {
    if(res.statusCode === 200) {
      console.log('请求 ' + url + ' 成功')
      var $ = cheerio.load(res.body);
      var items = [];
      $('#topic_list .topic_title').each(function (idx, element) {
        var $element = $(element);
        getContent('https://cnodejs.org' + $element.attr('href'))
        .then(function(content) {
          var article = new Article({title: $element.attr('title'), href: 'https://cnodejs.org' + $element.attr('href'), content: content})
          article.save();
        });
      });
   } else {
     console.log('请求 ' + url + ' 失败')
     return getSinglePage(url);
   }
 }).catch(function(err) {
   console.log('请求 ' + url + ' 失败');
   return getSinglePage(url);
 });
}

function getContent(url) {
  return request.getAsync(url)
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
  Promise.map(urls, function(url) {
    return getSinglePage(url)
  }, {concurrency: 10});
}
start();

module.exports = {
  getContent: getContent
}



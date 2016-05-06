var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/crawler');
var db = mongoose.connection;
db.on('error', function(err) {
  console.log(err.stack);
});

var articleSchema = mongoose.Schema({
  title: String,
  href: String,
  content: String
});

var Article = mongoose.model('Article', articleSchema);

var a = new Article({title: 'test', href: 'www.baidu', content: 'hello world'});

console.log(a.title)
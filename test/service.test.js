var service = require('../service');
var should = require('should');
describe('test service.js', function() {
  it('test getContent()', function(done) {
    service.getContent('https://cnodejs.org/topic/4f16442ccae1f4aa27001089')
    .then(function(data) {
      console.log(data);
    }).nodeify(done)
  });
});
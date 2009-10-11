var PathResource = require('../../lib/vroom/path_resource.js');

exports.resource = new PathResource(function (r) {
  
  r.get('/', function () {
    return "Post Index.";
  });
  
  r.get('/all', function () {
    this.foo = "<p>Hello World.</p>";
    this.ejs("posts/all");
  });
  
  r.get('/boom', function () {
    throw(this.Exceptions.InternalServerError("The app went boom!"));
    return "Not going to get here.";
  });
  
});

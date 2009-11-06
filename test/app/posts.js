var PathResource = require('../../lib/vroom/path_resource');

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
  
  r.get('/new', function () {
    this.status = 200;
    this.ejs('posts/new');
  });
  
  r.post('/', function () {
    return "POST to /post/";
  });
  
});

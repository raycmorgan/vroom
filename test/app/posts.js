exports.resource = new Vroom.PathResource(function(r) {
  
  r.get('/', function() {
    return "Post Index.";
  });
  
  r.get('/all', function() {
    this.foo = "<p>Hello World.</p>";
    this.ejs("posts/all");
  });
  
  r.get('/boom', function () {
    throw(Vroom.Exceptions.InternalServerError);
    return "Not going to get here.";
  });
  
});

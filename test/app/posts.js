exports.resource = new Vroom.PathResource(function(r) {
  
  r.get('/', function() {
    return "Post Index.";
  });
  
  r.get('/all', function() {
    this.foo = "<p>Hello World.</p>";
    this.ejs("posts/all");
  });
  
});

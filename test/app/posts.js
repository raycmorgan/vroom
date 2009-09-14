exports.resource = new Vroom.PathResource(function() {
  
  get('/', function() {
    return "Post Index.";
  });
  
  get('/all', function() {
    this.foo = "<p>Hello World.</p>";
    ejs("posts/all");
  });
  
});
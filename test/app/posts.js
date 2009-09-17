exports.resource = new Vroom.PathResource(function() { with (this) {
  
  get('/', function() {
    return "Post Index.";
  });
  
  get('/all', function() {
    this.foo = "<p>Hello World.</p>";
    this.ejs("posts/all");
  });
  
}});
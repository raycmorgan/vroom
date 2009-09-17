exports.resource = new Vroom.PathResource(function() { with (this) {
  
  get('/', function() {
    this.status = 200;
    this.addHeader('Content-Type', "text/plain");
    return 'Hello World';
  });
  
  get('/about', function() {
    addHeader('Content-Type', "text/plain");
    return "About this page.";
  });
  
}});
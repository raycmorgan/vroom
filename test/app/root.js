exports.resource = new Vroom.PathResource(function(r) {
  
  r.get('/', function() {
    this.status = 200;
    this.addHeader('Content-Type', "text/plain");
    return 'Hello World';
  });
  
  r.get('/about', function() {
    this.addHeader('Content-Type', "text/plain");
    return "About this page.";
  });
  
});
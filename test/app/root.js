exports.resource = new Vroom.PathResource(function() {
  
  get('/', function() {
    status = 200;
    addHeader('Content-Type', "text/plain");
    return 'Hello World';
  });
  
  get('/about', function() {
    addHeader('Content-Type', "text/plain");
    return "About this page.";
  });
  
});
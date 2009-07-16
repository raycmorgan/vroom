exports.resource = function() {
  get("/", function() {
    puts("Welcome to Vroom!");
    finish();
  });
  
  get("/favicon.ico", function() {
    status = 404;
    sendHeader();
    finish();
  });
}
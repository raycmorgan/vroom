exports.resource = function() {
  get("/", function() {
    return "Welcome to Vroom!";
  });
  
  get("/favicon.ico", function() {
    status = 404;
    sendHeader();
    finish();
  });
}
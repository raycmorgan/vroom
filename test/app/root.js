exports.resource = function() {
  get("/", function() {
    puts("Welcome to Juice!");
    finish();
  });
  
  get("/favicon.ico", function() {
    status = 404;
    sendHeader();
    finish();
  });
}
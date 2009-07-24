exports.resource = function() {
  get("/", function() {
    if (params.second == "true")
      return PASS;
    
    return "Welcome to Vroom!\n";
  });
  
  get("/", function() {
    return "Second Root\n";
  });
  
  get("/favicon.ico", function() {
    status = 404;
    sendHeader();
    finish();
  });
}
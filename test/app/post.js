exports.resource = function() {
  get("/", function() {
    application.LOG.info("Handling / request post.js");
    
    puts("Hello Index.");
    finish();
  });
  
  get("/:id", function(id) {
    // ejs helper will send headers and finish the request automatically
    //   If you do not want this to happen and you wish to manually send
    //   headers and finish the request (maybe due to a streaming response)
    //   add {autoFinish: false} as a second param.
    //
    //      ejs("post/show", {autoFinish: false});
    //
    ejs("post/show");
  });
  
  get("/by-date/:year(/:month(/:day))", function(year, month, day) {    
    ejs("post/by-date");
  });
}

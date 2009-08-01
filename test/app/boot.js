var vroom = require("../../lib/vroom.js");

// Gather the resources
var root = require("root.js");
var post = require("post.js");

// Get the error handler
var errors = require("errors.js");

function onLoad() { 
  var app = vroom.createApp();
  
  app.LOG.setLevel("INFO");
  app.root = __filename;
  
  app.mount("/", root);
  app.mount("/post", post);
  
  app.errorHandler(errors.handlers);
    
  app.boot({port: 8000});
  app.LOG.warn("Application Booted");
}
var vroom = require("../../lib/vroom.js");
var Logger = require("../../lib/vroom/logger.js");

// Gather the resources
var root = require("root.js");
var post = require("post.js");

function onLoad() {
  Logger.setLevel("WARN");
  
  var app = vroom.createApp();
  app.LOG = Logger;
  app.rootDir = node.path.dirname(__filename);
  
  app.mount("/", root);
  app.mount("/post", post);
    
  app.boot({port: 8000});
  Logger.warn("Application Booted");
}
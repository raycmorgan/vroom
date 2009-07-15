var Juice = require("../../lib/juice.js");
var Logger = require("../../lib/juice/logger.js");
var post = require("post.js");

function onLoad() {
  Logger.setLevel("WARN");
  
  var juice = Juice.createApp();
  juice.LOG = Logger;
  juice.rootDir = node.path.dirname(__filename);
  
  juice.mount("/post", post);
    
  juice.boot({port: 4000});
  Logger.warn("Application Booted");
}
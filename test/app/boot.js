var Juice = require("../../lib/juice.js");
var Logger = require("../../lib/juice/logger.js");
var post = require("post.js");

function onLoad() {
  Logger.setLevel("WARN");
  
  Logger.info("Creating Application");
  var juice = Juice.createApp();
  juice.LOG = Logger;
  
  Logger.info("Mounting /post");
  juice.mount("/post", post);
    
  Logger.info("Booting Application");
  juice.boot();
  Logger.warn("Application Booted");
}
var Juice = require("../../lib/juice.js");
var post = require("post.js");

function onLoad() {
  var juice = Juice.createApp();
  
  juice.mount("/post", post);
  
  juice.boot();
}
var logger = require("logger.js");
var request = require("request.js");

exports.createServer = function(callback, opts) {
  return new Server(callback, opts);
}


function Server(callback, opts) {
  opts = opts || {};
  this.port = opts.port || 8000;
  this.hostname = opts.hostname || null;
  
  var that = this;
  this.server = node.http.createServer(function(req, res) {
    var r = request.createRequest(that, req, res);
    return callback.call(r);
  });
}

Server.prototype = {
  start: function() {
    logger.info("Starting vroom server on: " + this.port);
    this.server.listen(this.port, this.hostname);
  },
  
  stop: function() {
    this.server.close();
  }
}

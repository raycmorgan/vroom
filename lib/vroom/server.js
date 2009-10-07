/**
 * Constructor for the Vroom.Server. The server is a thin wrapper over
 * the require("/http.js").Server. It is responsible for accepting new connections
 * and dispatching them to the given callback.
 * 
 * @param {Function} callback The function to send requests to
 * @param {Object} opts Options to configure the server
 * @options {Vroom.Applicaiton} opts.application The application that the
 *                  callback is scoped with. Must define LOG.
 * @options {Number} opts.port The port to listen on
 * @options {String} opts.host The host to bind to
 */
exports.Server = function Server(callback, opts) {
  opts = opts || {};
  this.port = opts.port || 8000;
  this.host = opts.host || null;
  this.application = opts.application || {};
  
  var self = this;
  this.server = require("/http.js").createServer(function (req, res) {
    var r = new Vroom.Request(self.application, req, res);
    return callback.call(self.application, r);
  });
};

exports.Server.prototype = {
  /**
   * Begin listening to the set host and port.
   */
  start: function () {
    this.application.LOG.info("Listening on: " + (this.host || "127.0.0.1") + ":" + this.port);
    this.server.listen(this.port, this.host);
  },
  
  /**
   * Stop the server from listening to new connections. 
   */
  stop: function () {
    this.server.close();
  }
}

var params = require("params.js");

/**
 * Creates a new Request instance
 * @api public
 * @see Request
 *
 * @param {Object} server A Node.js HTTP server instance
 * @param {Object} req A Node.js HTTP request instance
 * @param {Object} res A Node.js HTTP response instance
 * @returns A new Request instance
 * @type Request
 */
exports.createRequest = function(server, req, res) {
  return new Request(server, req, res);
}

/**
 * A class that represents an HTTP request. It wraps the Node.js request and
 * response objects.
 *
 * @author RayMorgan
 * @constructor
 * @see exports.createRequest
 */
function Request(server, req, res) {
  this.server = server;
  this.req = req;
  this.res = res;
  
  this._header = [];
  this._status = 404;
  
  this.finished = false;
  
  this.captured = {};
}

Request.prototype = {
  /**
   * Sets the HTTP status code of the response
   * @api public
   *
   * @setter _status
   * @param {Number} val The status code to set
   */
  set status(val) {
    this._status = Number(val);
  },
  
  /**
   * Adds an HTTP response header line
   * @api public
   *
   * @param {String} name The name of the header field
   * @param {String} value The value of the header field
   */
  addHeader: function(name, value) {
    this._header.push([name, value]);
  },
  
  /**
   * Removes all occurances of a header field with the given name
   * @api public
   *
   * @param {String} name The name of the header field to remove
   */
  removeHeader: function(name) {
    this._header = this._header.filter(function(header) {
      return (header[0] != name);
    });
  },
  
  /**
   * Sends the status code and header fields to the client. After this is called
   * no more header fileds can be added. This must be called prior to calling
   * Request.puts
   * @api public
   */
  sendHeader: function() {
    this.res.sendHeader(this._status, this._header);
  },
  
  /**
   * Sends a string to the client. Can be called any number of times after
   * Request.sendHeader but before Request.finish
   * @api public
   *
   * @param {String...} ... Strings to send to the client
   */
  puts: function() {
    for (i = 0; i < arguments.length; i++)
      this.res.sendBody(arguments[i]);
  },
  
  /**
   * Finishes the request with the client. Must be called for every request.
   * @api public
   */
  finish: function() {
    this.res.finish();
    this.finished = true;
  },
  
  /**
   * Returns and memoizes the parsed query string for the request. This is
   * not to be caled directly. Use the params getter instead.
   * @private
   * @see params
   *
   * @returns The params for the request
   * @type Object
   */
  getParams: function() {
    var query = this.req.uri.query;
    if (!query) {
      this.getParams = function() { return {}; };
      return {};
    }
    
    var p = params.parse(query);
    
    this.getParams = function() { return p; };
    return p;
  },
  
  /**
   * Get the path of the request
   * @api public
   *
   * @returns The request's path
   * @type String
   */
  get path() {
    return this.req.uri.path || "/";
  },
  
  /**
   * Get the request method ('GET', 'POST', 'PUT', 'DELETE', etc)
   * @api public
   *
   * @getter
   * @returns The request method
   * @type String
   */
  get method() {
    return this.req.method;
  },
  
  /**
   * Get the parsed query string for the request.
   * @api public
   *
   * @getter
   * @returns The Object representing the parsed query string
   * @type Object
   */
  get params() {
    return this.getParams();
  }
}

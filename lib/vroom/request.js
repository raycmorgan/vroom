/**
 * Creates a new Request instance
 *
 * @param {Object} application A Vroom Application instance
 * @param {Object} req A Node.js HTTP request instance
 * @param {Object} res A Node.js HTTP response instance
 * @returns {Vroom.Request} A new Request instance
 */
exports.Request = function Request(application, req, res) {
  this.application = application;
  this.req = req;
  this.res = res;
  
  this.LOG = this.application.LOG;
  
  this.hasSentHeader = false;
  this.finished = false;
  
  this._status = 404;
  this._header = {};
};

exports.Request.prototype = {
  /**
   * Get the status that is going to be or has been sent to the client.
   * 
   * @returns {Number} The status code 
   */
  get status() {
    return this._status;
  },
  
  /**
   * Set the status code to send to the client.
   * Must be called prior to Request.sendHeader.
   * 
   * @param {Number} val The status code to send to the client
   */
  set status(val) {
    var s = new Number(val);
    if (!isNaN(s))
      this._status = s;
  },
  
  /**
   * Add a HTTP header field.
   * Must be called prior to sendHeader.
   * 
   * @param {String} key The HTTP header key
   * @param {String} value The HTTP header value 
   */
  addHeader: function(key, value) {
    this._header[key] = value;
  },
  
  /**
   * Add multiple HTTP headers.
   * Must be call prior to Request.sendHeader.
   * 
   * @param {Object} headers Hash of headers to set
   */
  addHeaders: function(headers) {
    for (var k in headers)
      if (headers.hasOwnProperty(k))
        this.addHeaders(k, headers[k]);
  },
  
  /**
   * Remove a previously set HTTP header by key.
   * Must be called prior to Request.sendHeader.
   * 
   * @param {String} key The HTTP header key to remove 
   */
  removeHeader: function(key) {
    delete this._header[key];
  },
  
  /**
   * Send the HTTP status code and headers to the client. After this
   * is called the status code and headers can no longer be changed.
   * This should be called prior to Request.write.
   */
  sendHeader: function() {
    this.res.sendHeader(this._status, this._header);
    this.hasSentHeader = true;
  },
  
  /**
   * Sends a string to the client. Can be called any number of times after
   * Request.sendHeader but before Request.finish
   *
   * @param {String...} ... Strings to send to the client
   */
  write: function() {
    if (!this.hasSentHeader) {
      this.LOG.debug("Auto sending headers because 'write' was called before 'sendHeader'.");
      this.sendHeader();
    }
    
    if (!this.finished)
      for (var i = 0; i < arguments.length; i++)
        this.res.sendBody(arguments[i]);
  },
  
  /**
   * Finishes the request with the client. Must be called for every request.
   */
  finish: function() {
    this.res.finish();
    this.finished = true;
  },
  
  /**
   * Returns the HTTP parameters and memoizes it. Use the getter
   * instead of this method.
   * 
   * @returns {Object} The HTTP parameters
   */
  getParams: function() {
    return this.req.uri.params;
  },
  
  /**
   * Get the parsed query string for the request.
   * 
   * @returns {Object} The HTTP parsed parameters
   */
  get params() {
    return this.getParams();
  },
  
  /**
   * Get the path of the request.
   *
   * @returns {String} The request's path
   */
  get path() {
    return this.req.uri.path || "/";
  },
  
  /**
   * Get the request method ('GET', 'POST', 'PUT', 'DELETE', etc).
   *
   * @returns {String} The request method
   */
  get method() {
    switch (this.req.method) {
    case "OPTIONS":
    case "HEAD":
      return "GET";
    default:
      return this.req.method;
    }
  },
  
  /**
   * Returns the HTTP protocol.
   * 
   * @returns {String} The HTTP protocol
   */
  get protocol() {
    return (this.req.uri.protocol || "http");
  },
  
  /**
   * Returns the host of the request.
   * 
   * @returns {String} The HTTP host 
   */
  get host() {
    return (this.req.uri.host || this.server.hostname || "");
  }
};

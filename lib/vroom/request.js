var LOG = require("logger.js");
var params = require("params.js");
var EJS = require("ejs.js");

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
  this._status = null;
  
  this.hasSentHeader = false;
  this.finished = false;
  
  this.captured = {};
}

Request.prototype = {
  PASS: "vroom.PASS",
  
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
  
  get status() {
    return this._status;
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
   * Request.write
   * @api public
   */
  sendHeader: function() {
    this.res.sendHeader((this._status || 404), this._header);
    this.hasSentHeader = true;
  },
  
  /**
   * Sends a string to the client. Can be called any number of times after
   * Request.sendHeader but before Request.finish
   * @api public
   *
   * @param {String...} ... Strings to send to the client
   */
  write: function() {
    if (!this.hasSentHeader) {
      LOG.debug("Auto sending headers because 'write' was called before 'sendHeader'.");
      this.sendHeader();
    }
    
    if (!this.finished)
      for (var i = 0; i < arguments.length; i++)
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
  
  ejs: function(name, opts) {
    opts = opts || {};
    var promise = new node.Promise();
    var renderPromise = new node.Promise();
    var r = this;
    var config = this.application.config;
    var path = config.root + "/" + config.viewDir + "/" + name + ".html.ejs";
    puts("Using template: " + path);
    
    renderPromise.addCallback(function(tmpl) {
        if (opts.autoFinish !== false)
          r.addHeader("Content-Length", tmpl.length);
        
        r.write(tmpl);
        
        if (opts.autoFinish !== false)
          r.finish();
        
        promise.emitSuccess([tmpl]);
      });
      
    renderPromise.addErrback(function(err) {
        promise.emitError([err]);
      });
    
    EJS.render(renderPromise, path, this, {reload: config.reloadTemplates});
    
    return promise;
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
    switch (this.req.method) {
    case "OPTIONS":
    case "HEAD":
      return "GET";
    default:
      return this.req.method;
    }
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
  },
  
  get protocol() {
    return (this.req.uri.protocol || "http");
  },
  
  get host() {
    return (this.req.uri.host || this.server.hostname || "");
  }
}

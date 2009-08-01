var logger = require("logger.js");
var resource = require("resource.js");
var server = require("server.js");
var exception = require("exception.js");
var config = require("config.js");

/**
 * Creates a new Application instance.
 * @api public
 * @see Application
 */
exports.createApplication = function() {
  return new Application();
}
exports.createApp = exports.createApplication;

/**
 * A class to wrap an Application in. Each Application has its
 * own server and mounted resources.
 * @author RayMorgan
 * @see exports.createApplication
 */
function Application() {
  this.mounted = [];
  this.errorHandlers = {};
  this.LOG = logger;
  
  this.config = config.createConfig();
}

Application.prototype = {
  /**
   * Mounts the given resource to a give path.
   * @api public
   *
   * @param {String} path The root path to mount this resource on
   * @param {Object|Function} source Either the callback function for
   *                a resource or an object with the property 'resource'
   *                that is the callback for the resource
   */
  mount: function(path, source) {
    path = (path == "/") ? "" : path;
    source = (source instanceof Function) ? source : source.resource;
    var r = resource.createResource(source, path, this);
    this.mounted.push({'path': new RegExp("^" + path), 'resource': r});
  },
  
  /**
   * Boots the application's server. Allows for options to be passed in that
   * will be passed to the server to configure it.
   * @api public
   *
   * @param {Object} opts Server options
   */
  boot: function(opts) {
    var app = this;
    var s = server.createServer(function() {
      try {
        this.application = app;
        for (var i = 0; i < app.mounted.length; i++) {
          var m = app.mounted[i];
          if (m.path.exec(this.path) && (ret = m.resource.routeFor[this.method](this.path, this)) !== this.PASS)
            return ret;
        }
        throw(exception.NotFound("Resource Not Found"));
      } catch (e) {
        if (!e.type)
          e = exception.InternalServerError("Uncaught Exception\n\n" + e);
        
        try {
          if (typeof(app.errorHandlers[e.status]) == "function")
            return app.errorHandlers[e.status].call(this);
          else
            throw(e);
        } catch (e) {
          logger.error("Uncaught exception - " + e);
        }
      }
      
      this.status = 500;
      this.sendHeader();
      this.write("500 - Internal Server Error");
      this.finish();
    }, opts);
    
    s.start();
  },
  
  errorHandler: function(handler) {
    this.errorHandlers = handler;
  },
  
  addErrorHandler: function(status, callback) {
    this.errorHandlers[status] = callback;
  },
  
  configure: function(c) {
    this.config.configure(c);
  }
}

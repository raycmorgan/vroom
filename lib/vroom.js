var logger = require("vroom/logger.js");
var resource = require("vroom/resource.js");
var server = require("vroom/server.js");

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
  this.LOG = logger;
  
  this._root = "./";
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
      } catch (e) {
        logger.error("Uncaught exception: " + e);
      }
      
      this.status = 404;
      this.sendHeader();
      this.write("404 - No Resource Found");
      this.finish();
    }, opts);
    
    s.start();
  },
  
  set root(path) {
    if (/\.[^./]+$/.exec(path))
      this._root = node.path.dirname(path);
    else
      this._root = path;
  },
  
  get root() {
    return this._root;
  }
}
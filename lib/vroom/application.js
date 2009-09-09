/**
 * Constructor for a Vroom.Application. This is responsible for
 * the general configuration and mountings. This also defines
 * the main request handler for a Vroom.Server.
 * 
 * @param {Function} callback A convenience callback that will be
 *                    called at the end of the initializer
 */
exports.Application = function Application(callback) {
  this.LOG = new Vroom.Logger();
  this.config = new Vroom.Config(this);
  this.mounted = [];
  
  if (callback)
    callback.call(this);
  
  this.hook('after', 'initialize', []);
};

exports.Application.prototype = {
  /**
   * Mounts a resource to the application. Mounting is done in a
   * FIFO (stack) order. The resource is mounted to a given root
   * path. It can also be assigned a name, used for URL generation.
   * 
   * @param {String} (name) The name of the resource
   * @param {String} root The root path that the resource is mounted on
   * @param {Function} resource The function to be called if the root
   *                    path matches
   * @returns {Number} The number of mounted resources
   */
  mount: function(name, root, resource) {
    if (typeof(name) == "object")
      return this.mount(name.name, name.path, name.resource);
    
    if (resource instanceof Function) {
      resource = this.hook('on', 'mount', [resource]);
      return this.mounted.push({
        name: name,
        root: new RegExp("^" + root),
        resource: resource
      });
    }
    
    if (typeof(resource) == "object")
      if (resource.resource)
        return this.mount(resource.resource);
      else if (resource.compile)
        return this.mount(resource.compile());
    
    throw "Failed to mount resource.";
  },
  
  /**
   * Starts the underlying Vroom.Server.
   * 
   * @param {Object} opts Options to be passed to the server
   * @see Vroom.Server
   */
  boot: function(opts) {
    opts = opts || {};
    opts.application = this;
    
    this.server = new Vroom.Server(this.requestHandler, opts);
    this.server.start();
  },
  
  /**
   * The default request handler that is sent to the Vroom.Server.
   * 
   * @param {Vroom.Request} request The request object for the current request.
   */
  requestHandler: function(request) {
    for (var i = 0; i < this.mounted.length; i++) {
      if (this.mounted[i].root.exec(request.path)) {
        var ret;
        if ((ret = this.mounted[i].resource.call(request)) !== Vroom.PASS) {
          if (!request.finished && typeof(ret) == "string") {
            request.sendHeader();
            request.write(ret);
            request.finish();
          }
          return;
        }
      }
    }
    
    request.addHeader("Content-Type", "text/plain");
    request.write("Hello World.");
    request.finish();
  }
};



// var logger = require("logger.js");
// var resource = require("resource.js");
// var server = require("server.js");
// var exception = require("exception.js");
// var config = require("config.js");
// 
// /**
//  * Creates a new Application instance.
//  * @api public
//  * @see Application
//  */
// exports.createApplication = function() {
//   return new Application();
// }
// exports.createApp = exports.createApplication;
// 
// /**
//  * A class to wrap an Application in. Each Application has its
//  * own server and mounted resources.
//  * @author RayMorgan
//  * @see exports.createApplication
//  */
// function Application() {
//   this.mounted = [];
//   this.errorHandlers = {};
//   this.LOG = logger;
//   
//   this.config = config.createConfig();
// }
// 
// Application.prototype = {
//   /**
//    * Mounts the given resource to a give path.
//    * @api public
//    *
//    * @param {String} path The root path to mount this resource on
//    * @param {Object|Function} source Either the callback function for
//    *                a resource or an object with the property 'resource'
//    *                that is the callback for the resource
//    */
//   mount: function(path, source) {
//     path = (path == "/") ? "" : path;
//     source = (source instanceof Function) ? source : source.resource;
//     var r = resource.createResource(source, path, this);
//     this.mounted.push({'path': new RegExp("^" + path), 'resource': r});
//   },
//   
//   /**
//    * Boots the application's server. Allows for options to be passed in that
//    * will be passed to the server to configure it.
//    * @api public
//    *
//    * @param {Object} opts Server options
//    */
//   boot: function(opts) {
//     var app = this;
//     var s = server.createServer(function() {
//       try {
//         this.application = app;
//         for (var i = 0; i < app.mounted.length; i++) {
//           var m = app.mounted[i];
//           if (m.path.exec(this.path) && (ret = m.resource.routeFor[this.method](this.path, this)) !== this.PASS)
//             return ret;
//         }
//         throw(exception.NotFound("Resource Not Found"));
//       } catch (e) {
//         if (!e.type)
//           e = exception.InternalServerError("Uncaught Exception\n\n" + e);
//         
//         try {
//           if (typeof(app.errorHandlers[e.status]) == "function") {
//             var res = app.errorHandlers[e.status].call(this);
//             
//             if (typeof(res) == "string" && res !== this.PASS) {
//               this.sendHeader();
//               this.write(res);
//               this.finish();
//             }
//             
//             return res;
//           } else {
//             throw(e);
//           }
//         } catch (e) {
//           logger.error("Uncaught exception - " + e);
//         }
//       }
//       
//       this.status = 500;
//       this.sendHeader();
//       this.write("500 - Internal Server Error");
//       this.finish();
//     }, opts);
//     
//     s.start();
//   },
//   
//   errorHandler: function(handler) {
//     this.errorHandlers = handler;
//   },
//   
//   addErrorHandler: function(status, callback) {
//     this.errorHandlers[status] = callback;
//   },
//   
//   configure: function(c) {
//     this.config.configure(c);
//   }
// }
// 
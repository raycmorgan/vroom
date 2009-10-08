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
  this.exceptionHandler = null;
  
  if (callback)
    callback.call(this);
  
  this.hook('after_initialize', []);
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
  mount: function (name, root, resource) {
    if (typeof(name) == "object")
      return this.mount(name.name, name.path, name.resource);
    
    if (resource instanceof Function) {
      resource = this.hook('before_mounting_resource', [resource]);
      return this.mounted.push({
        name: name,
        root: (root instanceof RegExp) ? root : new RegExp("^" + root),
        resource: resource
      });
    }
    
    if (typeof(resource) == "object")
      if (resource.resource)
        return this.mount(name, root, resource.resource);
      else if (resource.compile)
        return this.mount(name, root, resource.compile(root, this));
    
    throw "Failed to mount resource.";
  },
  
  mountExceptionHandler: function (handler) {
    if (handler.handlers) {
      return this.mountExceptionHandler(handler.handlers);
    }
    
    handler = this.hook('before_mounting_exception_handler', [handler]);
    this.exceptionHandler = handler;
  },
  
  /**
   * Starts the underlying Vroom.Server.
   * 
   * @param {Object} opts Options to be passed to the server
   * @see Vroom.Server
   */
  boot: function (opts) {
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
  requestHandler: function (request) {
    try {
      var ret = this.callResources(request);
      if (ret === true) return true;
    } catch (e) {
      request.status = 500;
      
      if (!this.callExceptionHandler(request, e)) {
        request.addHeader("Content-Type", "text/plain");
        finishRequest(request, "500 - Internal Server Error");
      }
      return true;
    }
    request.status = 404;
    
    if (!this.callExceptionHandler(request, Vroom.Exceptions.NotFound)) {
      request.addHeader("Content-Type", "text/plain");
      finishRequest(request, "404 - Not Found");
    }
    return true;
  },
  
  /**
   * This function loops through the mounted resources and tries calling them.
   * 
   * @param {Vroom.Request} request The current request object
   * 
   * @throws {Vroom.Exception|Exception}
   * @returns {Boolean}
   */
  callResources: function (request) {
    for (var i = 0; i < this.mounted.length; i++) {
      if (this.mounted[i].root.exec(request.path)) {
        var ret;
        try {
          if ((ret = this.mounted[i].resource.call(request)) !== Vroom.PASS) {
            if (!request.finished && typeof(ret) == "string") {
              request.status = request.status || 200;
              finishRequest(request, ret);
            }
            return true;
          }
        } catch (e) {
          if (e.status) {
            request.status = e.status;
            return this.callExceptionHandler(request, e);
          } else {
            throw(e);
          }
        }
      }
    }
  },
  
  /**
   * This function is used to call the exception handler if one exists.
   * 
   * @param {Vroom.Request} request The current request object
   * @param {Exception} exception The exception to pass to the handler
   */
  callExceptionHandler: function (request, exception) {
    if (this.exceptionHandler && this.exceptionHandler[request.status]) {
      var ret = this.exceptionHandler[request.status].call(request, exception);
      if (!request.finished && typeof(ret) == "string") {
        finishRequest(request, ret);
      }
      return true;
    }
    return false;
  }
};

function finishRequest(request, contents) {
  request.addHeader('Content-Length', contents.length);
  request.sendHeader();
  request.write(contents);
  request.finish();
}

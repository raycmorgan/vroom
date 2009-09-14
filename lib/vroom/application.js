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
  mount: function(name, root, resource) {
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
    
    request.status = 404;
    request.addHeader("Content-Type", "text/plain");
    request.sendHeader();
    request.write("404 - Not Found");
    request.finish();
  }
};

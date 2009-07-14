var route = require("route.js");

/**
 * Create a new Resource instance
 * @api public
 *
 * @param {Function} resource The callback that will be ran to help construct
 *                            the Resource
 * @params {String} mountPoint (Optional) The path to append to all defined
 *                             resources.
 * @returns A new Resource instance
 * @type Resource
 */
function createResource(resource, mountPoint) {
  return new Resource(resource, mountPoint);
}
exports.createResource = createResource;

/**
 * Adds a method type to be handled. This method will be added to all Resources
 * @api public
 *
 * @param {String} name The name of the method type to be handled.
 */
function addMethod(name) {
  if (Resource.prototype[name])
    throw("Property of this name already exists.");
  
  Resource.prototype.methods.push(name.toUpperCase());
  Resource.prototype[name] = function(path, callback) {
    path = (path == "/") ? "" : path;
    this.actions[name.toUpperCase()] = this.actions[name.toUpperCase()] || [];
    var compiledRoute = route.compile(this.mountPoint + path);
    for (i = 0; i < compiledRoute.length; i++) {
      compiledRoute[i].callback = callback.toString();
      this.actions[name.toUpperCase()].push(compiledRoute[i]);
    }
  }
}
exports.addMethod = addMethod;


/**
 * The Resource class is the class that is used to build routing and callbacks
 * that will be used to serve the HTTP requests.
 * @author RayMorgan
 * @see createResource
 */
function Resource(resource, mountPoint) {
  this.mountPoint = mountPoint || "";
  this.actions = [];
  resource.call(this);
  this.compileRoutes();
}

Resource.prototype.methods = [];
["get", "post"].forEach(addMethod);

/**
 * Internally used to compile the routes. Creates a function for each
 * HTTP method used that is stored under resource.routeFor['<method>'].
 * @private
 */
Resource.prototype.compileRoutes = function() {
  this.routeFor = {};
  var methods = Resource.prototype.methods;
  for (i = 0; i < methods.length; i++) {
    var method = methods[i];
    var code = [];
    var actions = this.actions[method];
    
    if (!actions)
      continue;
    
    for (ii = 0; ii < actions.length; ii++) {
      var action = actions[ii];
      var route = action.route;
      var params = action.params;
      var callback = action.callback;
      
      var c =  "";
      c += "("
      c +=   "(match = " + route + ".exec(path))";
      c +=   " && ";
      c +=   "(request.setCaptured(match.slice(1)) !== false)";
      c +=   " && ";
      c +=   "((ret = (" + callback + ").apply(request, [])) !== 'pass')";
      c += ")";
      c += " { return ret; }\n";
      
      code.push(c);
    }
    
    code = code.join(" else if ");
    code = "function (path, request) { \n" +
              " if " + code;
    code +=   "\nelse {";
    // code +=   " request.raise(Juice.Exception.NotFound('Not Found: [' + request.method() + '] ' + path)); ";
    code +=   "}\n";
    code += "}";
    // node.debug(code);
    // Juice.Logger.trace(code);
    var fun = eval(code);
    this.routeFor[method] = function(path, request) {
      return fun(path, request);
    };
  }
}

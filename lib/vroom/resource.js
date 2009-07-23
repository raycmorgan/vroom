var route = require("route.js");

/**
 * Create a new Resource instance
 * @api public
 *
 * @param {Function} resource The callback that will be ran to help construct
 *                            the Resource
 * @params {String} mountPoint (Optional) The path to append to all defined
 *                             resources.
 * @params {Appliction} application (Optional) The application which the
                              resource exists in.
 * @returns A new Resource instance
 * @type Resource
 */
function createResource(resource, mountPoint, application) {
  return new Resource(resource, mountPoint, application);
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
function Resource(resource, mountPoint, application) {
  this.mountPoint = mountPoint || "";
  this.application = application || {};
  this.actions = [];
  resource = eval(resource.toString().replace(/\{/, "{ with(this) {") + "}");
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
      var params = [];
      var callback = action.callback;
      
      // This allows a resources to not have ot put "this" to interact
      // with the request object
      callback = callback.replace(/\{/, "{ with (this) { ") + "}";
      
      // This will be used to store the captured vars into the request object.
      for (key in action.params)
        if (action.params.hasOwnProperty(key))
          params.push("'" + key + "': match[" + action.params[key] + "]");
      
      // This is the magic that allows for the named variables in the 
      // resource callbacks to match the captured names in the route.
      var vars = callback.split(/ *function *\(/)[1]  // remove the function keyword
                         .split(/\)/)[0]              // remove the function body
                         .replace(/ /g, "")           // get rid of whitespace
                         .split(",")                  // split params on commas
                         .filter(function(v) {        // remove empty strings
                           return v != "";
                         });
      
      vars = vars.map(function(v) {
        if (action.params[v])
          return "match[" + (action.params[v]) + "]";
        else
          return "null";
      });
      
      // Here we actually build the if statements for a route
      var c =  "";
      // We start by running the regexp against the path
      c += "("
      c +=   "(match = " + route + ".exec(path))";
      c +=   " && ";
      
      // Next we populate the captured values based on the mapping
      // built prior to this.
      c +=   "(";
      c +=     "request.captured = {"
      c +=       params.join(",");
      c +=     "}";
      c +=   ")";
      
      // And finally we call the callback function with the scope being
      // the request object and the params being the magic params built above.
      c +=   " && ";
      c +=   "((ret = (" + callback + ").apply(request, [" + vars.join(", ") + "])) !== 'pass')";
      c += ")";
      c += " { return ret; }\n";
      
      code.push(c);
    }
    
    code = code.join(" else if ");
    code = "function (path, request) { \n" +
              " if " + code;
    code +=   "\nelse {";
    code +=     "return 'pass';"
    // code +=   " request.raise(Exception.NotFound('Not Found: [' + request.method() + '] ' + path)); ";
    code +=   "}\n";
    code += "}";
    
    var fun = eval(code);
    this.routeFor[method] = function(path, request) {
      var res = fun(path, request);
      
      if (typeof(res) == "string" && res != "pass") {
        request.puts(res);
        request.finish();
      }
      
      return res;
    };
  }
}

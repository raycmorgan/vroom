var Route = require('path_resource/route.js');

exports.PathResource = function PathResource(callback) {
  this.routes = {'GET': []};
  
  // callback = eval(callback.toString().replace(/\{/, "{ with(this) {") + "}");
  callback.call(this);
};

exports.PathResource.prototype = {
  get: function(pathSpec, callback) {
    this.routes['GET'].push({pathSpec: pathSpec, callback: callback});
  },
  
  compile: function(rootPath, application) {
    this.application = application;
    var LOG = application.LOG;
    var routeFor = {};
    var methods = ['GET'];
    for (var i = 0; i < methods.length; i++) {
      var method = methods[i];
      var code = [];
      
      var actions = [];
      this.routes[method].forEach(function(action) {
        var compiledPathSpec = Route.compile((rootPath == "/" ? "" : rootPath) + (action.pathSpec == "/" ? "" : action.pathSpec));
        compiledPathSpec.forEach(function(path) {
          path.callback = action.callback;
          actions.push(path);
        });
      });
      
      if (!actions)
        continue;
      
      var callbacks = [];
      for (var ii = 0; ii < actions.length; ii++) {
        var action = actions[ii];
        var route = action.route;
        var params = [];
        var callback = action.callback;
        
        // callback = this.hook('before_compiling_callback', [callback.toString()]);
        
        // This will be used to store the captured vars into the request object.
        for (key in action.params)
          if (action.params.hasOwnProperty(key))
            params.push("'" + key + "': match[" + action.params[key] + "]");
        
        // This is the magic that allows for the named variables in the 
        // resource callbacks to match the captured names in the route.
        var vars = callback.toString()
                           .split(/ *function *\(/)[1]  // remove the function keyword
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
        c +=   "((ret = (callbacks[" + ii + "]).apply(request, [" + vars.join(", ") + "])) !== Vroom.PASS)";
        c += ")";
        c += " { return ret; }\n";
        
        code.push(c);
        callbacks.push(callback);
      }
      
      code = code.join(" else if ");
      code = "function (callbacks, path, request) { \n" +
                " if " + code;
      code +=   "\nelse {";
      code +=     "return Vroom.PASS;"
      code +=   "}\n";
      code += "}";
      
      var fun = eval(code);
      
      routeFor[method] = function(path, request) {
        var res = fun(callbacks, path, request);
        return res;
      };
    }
    
    var resource = this.hook('after_compile', [function() {
      var ret;
      if (routeFor[this.method] && (ret = routeFor[this.method](this.path, this)) !== Vroom.PASS)
        return ret;
      else
        return Vroom.PASS;
    }]);
    return resource;
  }
}

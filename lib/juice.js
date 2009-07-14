var resource = require("juice/dispatch/resource.js");
var server = require("juice/server.js");

exports.createApplication = function() {
  return new Application();
}
exports.createApp = exports.createApplication;

function Application() {
  this.mounted = [];
}

Application.prototype = {
  mount: function(path, source) {
    var r = resource.createResource(source.resource, path);
    this.mounted.push({'path': new RegExp("^" + path), 'resource': r});
  },
  
  boot: function(opts) {
    var app = this;
    var s = server.createServer(function() {      
      for (i = 0; i < app.mounted.length; i++) {
        var m = app.mounted[i];
        if (m.path.exec(this.path) && (ret = m.resource.routeFor[this.method](this.path, this)) !== "pass")
          return ret;
      }
      
      this.status = 404;
      this.sendHeader();
      this.puts("404 - No Resource Found");
      this.finish();
    }, opts);
    
    s.start();
  }
}
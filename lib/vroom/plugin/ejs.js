exports.install = function install(Vroom) {
  Vroom.Config.addOption('viewDir', "The directory views are served from.", ['{String}']);
  Vroom.Config.addOption('reloadTemplates', "Reload templates on each request, great for development.", ['false', 'true']);
  
  Vroom.Request.prototype.ejs = function (name, opts) {
    opts = opts || {};
    var promise = new node.Promise();
    var renderPromise = new node.Promise();
    var r = this;
    var config = this.application.config;
    var path;
    if (/^\//.exec(config.viewDir))
      path = config.viewDir + "/" + name + ".html.ejs";
    else
      path = config.root + "/" + (config.viewDir || ".") + "/" + name + ".html.ejs";
    this.application.LOG.debug("Using template: " + path);
  
    renderPromise.addCallback(function (tmpl) {
      r.status = r.status || 200;
      
      if (opts.autoFinish !== false)
        r.addHeader("Content-Length", tmpl.length);
      
      r.addHeader('Content-Type', 'text/html');
      r.sendHeader();
      r.write(tmpl);
    
      if (opts.autoFinish !== false)
        r.finish();
    
      promise.emitSuccess(tmpl);
    });
    
    renderPromise.addErrback(function (err) {
      promise.emitError(err);
    });
  
    render(renderPromise, path, this, {reload: config.reloadTemplates});
  
    return promise;
  };

  var cache = {};

  function compile(path) {
    var promise = new node.Promise();
  
    var cat_promise = node.fs.cat(path, "binary");
  
    cat_promise.addCallback(function (contents) {
      var tmpl = compile_string(contents);
      if (tmpl) {
        cache[path] = tmpl;
        promise.emitSuccess(tmpl);
      } else {
        promise.emitError("Template " + path + " failed to compile.");
      }
    });
  
    cat_promise.addErrback(function () {
      promise.emitError("File " + path + " was unreadable.");
    });
  
    return promise;
  }

  function compile_string(template) {
    /*
      This is based of of Yehuda Katz's jQuery template plugin.
    */
    var begin = "<%";
    var end = "%>";
  
    var rebegin = begin.replace(/([\]{}[\\])/g, '\\$1');
    var reend = end.replace(/([\]{}[\\])/g, '\\$1');

    var code = "self = self || {}; helpers = helpers || {}; with (helpers) { with (self) {" +
      "var _result = '';" +
        template
          .replace(/\r/g, '__CARRIAGE__')
          .replace(/\t/, '__TAB__')
          .replace(/\n/g, '__NEWLINE__')
          .replace(/^(.*)$/, end + '$1' + begin)
          .replace(new RegExp(reend + "(.*?)" + rebegin, "g"), function (text) {
            return text
              .replace(new RegExp("^" + reend + "(.*)" + rebegin + "$"), "$1")
              .replace(/\\/g, "\\\\")
              .replace(/'/g, "\\'")
              .replace(/^(.*)$/, end + "_result += '$1';" + begin);
          })
          .replace(new RegExp(rebegin + "=(.*?)" + reend, "g"), 
            "_result += (function () { if(typeof($1) == 'undefined' || ($1) == null) { if (helpers && helpers.undef) helpers.undef('$1'); return ''; } else return ($1) })(); ")
          .replace(new RegExp(rebegin + "(.*?)" + reend, "g"), ' $1 ')
          .replace(new RegExp("^" + reend + "(.*)" + rebegin + "$"), '$1')
          .replace(/__CARRIAGE__/g, '\\r')
          .replace(/__TAB__/g, '\\t')
          .replace(/__NEWLINE__/g, '\\n') +
      "_result = _result.replace(/^\\s*/, '').replace(/\\s*$/, '');\n" + 
      "return _result;\n" +
    "}}";

    return new Function("self", "helpers", code);
  }

  function render(promise, path, data, opts, helpers) {
    opts = opts || {};
    if (cache[path] && opts.reload !== true) {
      promise.emitSuccess([cache[path](data, helpers)]);
    } else {
      compile(path)
        .addCallback(function (tmpl) {
          promise.emitSuccess(tmpl(data, helpers));
        })
        .addErrback(function (err) {
          promise.emitError(err);
        });
    }
  }
}
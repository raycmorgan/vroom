var cache = {};

exports.compile = function(path) {
  var promise = new node.Promise();
  
  var cat_promise = node.fs.cat(path);
  
  cat_promise.addCallback(function(contents) {
    var tmpl = exports.compile_string(contents);
    if (tmpl) {
      cache[path] = tmpl;
      promise.emitSuccess([tmpl]);
    } else {
      promise.emitError(["Template " + path + " failed to compile."]);
    }
  });
  
  cat_promise.addErrback(function() {
    promise.emitError(["File " + path + " was unreadable."]);
  });
  
  return promise;
}

exports.compile_string = function(template) {
  /*
    This is based of of Yehuda Katz's jQuery template plugin.
    (c) Yehuda Katz
    You may distribute this code under the same license as jQuery (BSD or GPL)
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
          "_result += (function() { if(typeof($1) == 'undefined' || ($1) == null) { if (helpers.undef) helpers.undef('$1'); return ''; } else return ($1) })(); ")
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

exports.render = function(promise, path, data, helpers) {
  if (cache[path]) {
    promise.emitSuccess([cache[path](data, helpers)]);
  } else {
    exports.compile(path)
      .addCallback(function(tmpl) {
        promise.emitSuccess([tmpl(data, helpers)]);
      })
      .addErrback(function(err) {
        promise.emitError([err]);
      });
  }
}

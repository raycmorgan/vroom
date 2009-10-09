node.mixin(require("/mjsunit.js"));

var rootPath = "./" + node.path.dirname(__filename).replace(node.cwd(), "") + "/mjsunit/";
var contents = node.fs.readdir(rootPath).wait();
var tests = [];
var successful = 0;
var errors = [];

node.stdio.writeError("Running Vroom Test Suite\n\n");

contents.forEach(function (filename) {
  file = rootPath + filename;
  var stat = node.fs.stat(file).wait();
  if (stat.isFile() && /^test_/.exec(filename)) {
    tests.push(require("mjsunit/" + filename));
  }
});


tests.forEach(function (t) {
  if (t.tests) {
    var exitAsserts = t.tests.map(function (testFun) {
      var scope = {};
      if (t.beforeEach)
        t.beforeEach.call(scope);
      try {
        return testFun.call(scope);
      } catch (e) {
        return function () { throw(e); }
      }
    });
    
    process.addListener('exit', function () {
      exitAsserts.forEach(function (t) {
        try {
          if (typeof(t) == "function") {
            t();
          }
          node.stdio.writeError(".");
          successful++;
        } catch (e) {
          node.stdio.writeError("f");
          errors.push(e);
        }
      });
    });
  }
});

process.addListener('exit', function () {
  printErrors(errors);
  node.stdio.writeError("\n\n" + successful + " Passed, " + errors.length + " Failures\n");
});

function printErrors(errors) {
  for (var i = 0; i < errors.length; i++) {
    var e = errors[i];
    node.stdio.writeError("\n\n");
    if (e.stack) {
      node.stdio.writeError(e.stack);
    } else if (e.message) {
      node.stdio.writeError(e.message);
    } else {
      node.stdio.writeError(e);
    }
  }
}

var path  = require('path');
var posix = require('posix');

process.mixin(require("mjsunit"));

process.chdir(path.dirname(__filename));

var rootPath = path.join(process.cwd(), "/mjsunit/");
var contents = posix.readdir(rootPath).wait();
var tests = [];
var successful = 0;
var errors = [];

process.stdio.writeError("Running Vroom Test Suite\n\n");

contents.forEach(function (filename) {
  file = rootPath + filename;
  var stat = posix.stat(file).wait();
  if (stat.isFile() && /^test_/.exec(filename)) {
    tests.push(require(rootPath + filename.replace(/\.js$/, "")));
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
          green(".");
          successful++;
        } catch (e) {
          red("f");
          errors.push(e);
        }
      });
    });
  }
});

process.addListener('exit', function () {
  printErrors(errors);
  write("\n\n")
  if (successful) green(successful + " Passed");
  if (successful && errors.length) write(", ");
  if (errors.length) red(errors.length + " Failures");
  write("\n");
});

function printErrors(errors) {
  for (var i = 0; i < errors.length; i++) {
    var e = errors[i];
    write("\n\n");
    if (e.stack) {
      write(e.stack);
    } else if (e.message) {
      write(e.message);
    } else {
      write(e);
    }
  }
}

function write(str) {
  process.stdio.writeError(str);
}

function green(str) {
  process.stdio.writeError('\033[32m' + str + '\033[0m');
}

function red(str) {
  process.stdio.writeError('\033[31m' + str + '\033[0m');
}

include("mjsunit/mjsunit.js");
require("../lib/vroom.js");

var rootPath = "./" + node.path.dirname(__filename).replace(node.cwd(), "") + "/mjsunit/";
var contents = node.fs.readdir(rootPath).wait();
var tests = [];

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
      return testFun.call(scope);
    });
    
    process.addListener('exit', function () {
      exitAsserts.forEach(function (t) {
        if (typeof(t) == "function")
          t();
      });
    });
  }
});

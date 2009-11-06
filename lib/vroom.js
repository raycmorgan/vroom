var path = require('path');

var Vroom = {};
module.exports = Vroom;

process.mixin(Vroom, require('./vroom/loader'));

Vroom.version = "0.5";
Vroom.PASS = "PASS";

Vroom.installPlugin = function (plugin) {
  if (typeof(plugin) == "function") {
    plugin(Vroom);
  } else {
    plugin.install(Vroom);
  }
}

Vroom.require = function (path) {
  return require(path.join(path.dirname(__filename), path));
}

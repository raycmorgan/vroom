var Vroom = {};
__module.exports = Vroom;
node.mixin(Vroom, require('vroom/loader.js'));

Vroom.version = "0.5";
Vroom.PASS = "PASS";

// Vroom.Hooks(Vroom.Application);
// Vroom.Hooks(Vroom.PathResource);

Vroom.installPlugin = function (plugin) {
  if (typeof(plugin) == "function") {
    plugin(Vroom);
  } else {
    plugin.install(Vroom);
  }
}

Vroom.require = function (path) {
  return require(node.path.join(node.path.dirname(__filename), path));
}

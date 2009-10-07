exports.Hooks = function Hooks(class) {
  exports.Hooks.events = {};
  
  class.prototype.hook = function (event, args) {
    var hooks = exports.Hooks.events[class] || {};
    hooks = hooks[event] || [];
    
    for (var i = 0; i < hooks.length; i++) {
      args = hooks[i].apply(this, args) || [];
    }
    
    if (args.length == 1)
      return args[0];
    else
      return args;
  };
  
  class.on = function (name, callback) {
    if (!exports.Hooks.events[class])
      exports.Hooks.events[class] = {};
    
    if (!exports.Hooks.events[class][name])
      exports.Hooks.events[class][name] = [];
    
    exports.Hooks.events[class][name].push(callback);
  }
}

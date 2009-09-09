var eventTypes = ['on', 'before', 'after'];

exports.Aspect = function Aspect(class) {
  exports.Aspect.events = {};
  
  eventTypes.forEach(function(type) {
    exports.Aspect.events[type] = {};
  });
  
  class.prototype.hook = function(event, name, args) {
    if (eventTypes.indexOf(event) == -1)
      throw "Event " + event + " not supported.";
    
    var hooks = exports.Aspect.events[event][class] || {};
    hooks = hooks[name] || [];
    
    for (var i = 0; i < hooks.length; i++) {
      args = hooks[i].apply(this, args) || [];
    }
    
    if (args.length == 1)
      return args[0];
    else
      return args;
  };
  
  eventTypes.forEach(function(type) {
    class[type] = function(name, callback) {
      if (!exports.Aspect.events[type][class])
        exports.Aspect.events[type][class] = {};
      
      if (!exports.Aspect.events[type][class][name])
        exports.Aspect.events[type][class][name] = [];

      exports.Aspect.events[type][class][name].push(callback);
    };
  });
}

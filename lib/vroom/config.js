exports.createConfig = function(config) {
  return new Config(config);
}

function Config(config) {
  this.root = ".";
  this.viewDir = ".";
}

Config.prototype = {
  configure: function(config) {
    for (var key in config)
      if (config.hasOwnProperty(key)) {
        this[key] = config[key];
      }
  },
  
  set root(path) {
    if (/\.[^./]+$/.exec(path))
      this._root = node.path.dirname(path);
    else
      this._root = path;
  },
  
  get root() {
    return this._root;
  }
}

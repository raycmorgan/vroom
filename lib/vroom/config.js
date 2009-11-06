var Vroom = module.parent.exports.Vroom;
var path  = require('path');
var sys   = require("sys");
var print = sys.print;

/**
 * Constructor for the Vroom.Config class. This class is responsible
 * for the configuration of the Vroom.Application.
 * 
 * @param {Vroom.Application} application The application the config is for
 */
exports.Config = function Config(application) {
  this.application = application;
  
  this.root = ".";
}

var Conf = exports.Config;

Conf.options = [];

/**
 * Add a configurable option.
 * 
 * @param {String} name The name of the option
 * @param {String} desc The description of the option
 * @param {Array} values Values the option can be set to 
 */
Conf.addOption = function (name, desc, values) {
  Conf.options.push({
    name: name,
    desc: desc,
    values: values
  });
};

/**
 * Checks to see if a given option name actually exists.
 * 
 * @param {String} name The name of the option to test for 
 */
Conf.hasOption = function (name) {
  for (var i = 0; i < Conf.options.length; i++)
    if (Conf.options[i].name == name)
      return true;
  return false;
}

/**
 * Prints the options in a pretty human-readable format.
 */
Conf.printOptions = function () {
  var options = Conf.options;
  
  print("Configuration Options:\n");
  options.forEach(function (option) {
    print("\n  " + option.name);
    if (option.desc)
      print(" - " + option.desc);
    if (option.values)
      print("\n    " + "Values: " + option.values.join(" | "));
    print("\n")
  });
  print("\n");
}

Conf.addOption("root", "The filepath to use as the root of the application.", ["{String}"]);
Conf.addOption("logLevel", "Sets the log level.", ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']);



exports.Config.prototype = {
  /**
   * Used to set the configuration options.
   * 
   * @example
   * app.config.use(function (c) {
   *   c['root'] = __filename;
   *   c['logLevel'] = "WARNa";
   * });
   * 
   * @param {Function} callback The function that is used to configure the options
   */
  use: function (callback) {
    var obj = {};
    callback(obj);
    for (var k in obj)
      if (obj.hasOwnProperty(k)) {
        if (Vroom.Config.hasOption(k))
          this[k] = obj[k];
        else
          this.application.LOG.warn("Configuration property '" + k + "' is not defined.");
      }
  },
  
  /**
   * Sets the root path. If a filename is sent, it will be set to the
   * directory of the file.
   * 
   * @param {String} path The directory path or file path 
   */
  set root(path) {
    if (/\.[^./]+$/.exec(path))
      this._root = path.dirname(path);
    else
      this._root = path;
  },
  
  /**
   * Gets the root path.
   * 
   * @returns {String} The root path 
   */
  get root() {
    return this._root;
  },
  
  /**
   * Sets the applications LOG level.
   * 
   * @param {String} level The log level to set to 
   */
  set logLevel(level) {
    this.application.LOG.level = level;
  }
}

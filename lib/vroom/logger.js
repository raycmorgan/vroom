var sys = require("sys");

exports.Logger = function Logger(startingLevel) {
  this._level = levels[startingLevel] || 1;
};

var levels = {
  TRACE: 1,
  DEBUG: 2,
  INFO:  3,
  WARN:  4,
  ERROR: 5,
  FATAL: 6
};

exports.Logger.prototype = {
  /**
   * Sets the log level to the given level
   * @api public
   *
   * @param {'TRACE'|'DEBUG'|'INFO'|'WARN'|'ERROR'|'FATAL'} level The level to
   *                                                              set logging to
   */
  set level(level) {
    this._level = levels[level] || this._level;
  },
  
  /**
   * Log a TRACE level log
   * @api public
   *
   * @param {String...} ... Strings to log
   */
  trace: function trace() {
    if (this._level <= levels.TRACE)
      log.apply(this, ["TRACE", arguments]);
  },


  /**
   * Log a DEBUG level log
   * @api public
   *
   * @param {String...} ... Strings to log
   */
  debug: function debug() {
    if (this._level <= levels.DEBUG)
      log.apply(this, ["DEBUG", arguments]);
  },

  /**
   * Log a INFO level log
   * @api public
   *
   * @param {String...} ... Strings to log
   */
  info: function info() {
    if (this._level <= levels.INFO)
      log.apply(this, ["INFO", arguments]);
  },

  /**
   * Log a WARN level log
   * @api public
   *
   * @param {String...} ... Strings to log
   */
  warn: function warn() {
    if (this._level <= levels.WARN)
      log.apply(this, ["WARN", arguments]);
  },

  /**
   * Log a ERROR level log
   * @api public
   *
   * @param {String...} ... Strings to log
   */
  error: function error() {
    if (this._level <= levels.ERROR)
      log.apply(this, ["ERROR", arguments]);
  },

  /**
   * Log a FATAL level log
   * @api public
   *
   * @param {String...} ... Strings to log
   */
  fatal: function fatal() {
    if (this._level <= levels.FATAL)
      log.apply(this, ["FATAL", arguments]);
  }
}

/**
 * Log the actual message.
 * @private
 *
 * @param {String} level The type of the log message
 * @param {Array} args The strings to log 
 */
function log(level, args) {
  var buffer = "[" + level + "] ";
  for (var i = 0; i < args.length; i++)
    if (typeof(args[i]) == "string")
      buffer += args[i];
    else
      buffer += JSON.stringify(args[i]);
  sys.puts(buffer);
}

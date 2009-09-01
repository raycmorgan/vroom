(function () {
  exports.createLogger = function createLogger(startingLevel) {
    return new exports.Logger(startingLevel);
  }
  
  exports.Logger = function Logger(startingLevel) {
    this._level = levels[startingLevel] || 1;
  }
  
  var levels = {
    TRACE: 1,
    DEBUG: 2,
    INFO:  3,
    WARN:  4,
    ERROR: 5,
    FATAL: 6
  };

  Logger.prototype = {
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
    this.trace = function trace() {
      if (logLevel <= levels.TRACE)
        log.apply(this, ["TRACE", arguments]);
    }


    /**
     * Log a DEBUG level log
     * @api public
     *
     * @param {String...} ... Strings to log
     */
    this.debug = function debug() {
      if (logLevel <= levels.DEBUG)
        log.apply(this, ["DEBUG", arguments]);
    }

    /**
     * Log a INFO level log
     * @api public
     *
     * @param {String...} ... Strings to log
     */
    this.info = function info() {
      if (logLevel <= levels.INFO)
        log.apply(this, ["INFO", arguments]);
    }

    /**
     * Log a WARN level log
     * @api public
     *
     * @param {String...} ... Strings to log
     */
    this.warn = function warn() {
      if (logLevel <= levels.WARN)
        log.apply(this, ["WARN", arguments]);
    }

    /**
     * Log a ERROR level log
     * @api public
     *
     * @param {String...} ... Strings to log
     */
    this.error = function error() {
      if (logLevel <= levels.ERROR)
        log.apply(this, ["ERROR", arguments]);
    }

    /**
     * Log a FATAL level log
     * @api public
     *
     * @param {String...} ... Strings to log
     */
    this.fatal = function fatal() {
      if (logLevel <= levels.FATAL)
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
    var buffer = "[" + level + "] " + JSON.stringify(new Date());
    for (var i = 0; i < args.length; i++)
      if (typeof(args[i]) == "string")
        buffer += "\t" + args[i];
      else
        buffer += "\t" + JSON.stringify(args[i]);
    puts(buffer);
  }
  
})();

logLevel = 1;

var levels = {
  TRACE: 1,
  DEBUG: 2,
  INFO:  3,
  WARN:  4,
  ERROR: 5,
  FATAL: 6
};

/**
 * Sets the log level to the given level
 * @api public
 *
 * @param {'TRACE'|'DEBUG'|'INFO'|'WARN'|'ERROR'|'FATAL'} level The level to
 *                                                              set logging to
 */
exports.setLevel = function(level) {
  logLevel = levels[level] || logLevel;
}

/**
 * Log a TRACE level log
 * @api public
 *
 * @param {String...} ... Strings to log
 */
exports.trace = function() {
  if (logLevel <= levels.TRACE)
    log.apply(this, ["TRACE", arguments]);
}


/**
 * Log a DEBUG level log
 * @api public
 *
 * @param {String...} ... Strings to log
 */
exports.debug = function() {
  if (logLevel <= levels.DEBUG)
    log.apply(this, ["DEBUG", arguments]);
}

/**
 * Log a INFO level log
 * @api public
 *
 * @param {String...} ... Strings to log
 */
exports.info = function() {
  if (logLevel <= levels.INFO)
    log.apply(this, ["INFO", arguments]);
}

/**
 * Log a WARN level log
 * @api public
 *
 * @param {String...} ... Strings to log
 */
exports.warn = function() {
  if (logLevel <= levels.WARN)
    log.apply(this, ["WARN", arguments]);
}

/**
 * Log a ERROR level log
 * @api public
 *
 * @param {String...} ... Strings to log
 */
exports.error = function() {
  if (logLevel <= levels.ERROR)
    log.apply(this, ["ERROR", arguments]);
}

/**
 * Log a FATAL level log
 * @api public
 *
 * @param {String...} ... Strings to log
 */
exports.fatal = function() {
  if (logLevel <= levels.FATAL)
    log.apply(this, ["FATAL", arguments]);
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
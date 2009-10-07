exports.mock = function () {
  var obj = {};
  obj.trace = function () {};
  obj.debug = function () {};
  obj.info = function () {};
  obj.warn = function () {};
  obj.error = function () {};
  obj.fatal = function () {};
  
  return obj;
}

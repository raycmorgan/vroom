exports.mock = function(opts) {
  opts = opts || {};
  var res = {};
  
  res.sendHeader = opts.sendHeader || function() {};
  res.sendBody = opts.sendBody || function() {};
  res.finish = opts.finish || function () {};
  
  return res;
}
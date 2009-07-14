exports.mock = function(opts) {
  opts = opts || {};
  var req = {uri: {}};
  
  req.method = opts.method || "GET";
  req.uri.query = opts.query;
  req.uri.path = opts.path || "";
  
  return req;
}
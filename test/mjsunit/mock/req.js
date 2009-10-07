exports.mock = function (opts) {
  opts = opts || {};
  var req = {uri: {}};
  
  req.method = opts.method || "GET";
  req.uri.query = opts.query;
  req.uri.path = opts.path || "";
  req.uri.params = opts.params || {};
  req.uri.host = opts.host || null;
  
  return req;
}
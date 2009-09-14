
/**
 * Compiles a route string into a list of RegEx's for the different
 * optional paths.
 * @api private
 *
 * @param {String} The route string to compile
 * @returns A list of RegEx's for the different optional paths.
 * @type Array
 */
function compile(path) {
  var paths = deriveBranches(path);
  return paths.map(function(path) {
    return compilePath(path);
  });
}
exports.compile = compile;
  
  
/**
 * Compiles a single route branch into a RegExp.
 * @api private
 * @private
 *
 * @param {String} The route string to compile
 * @returns A RegExp string of the compiled route
 * @type String
 */
function compilePath(path) {
  path = (path == "/") ? "" : path;
  var params = {};
  var optonalEndSlash = true;
  var r = "/^";
  var buffer = new PathBuffer();
  
  for (var i = 0; i < path.length; i++) {
    var letter = path[i];
    switch (letter) {
    case "/":
      r += buffer.toMatch(params, optonalEndSlash) + "\\/";
      break;
    case ".":
      r += buffer.toMatch(params, optonalEndSlash) + "\\.";
      optonalEndSlash = false;
      break;
    case ";":
      r += buffer.toMatch(params, optonalEndSlash) + ";";
      optonalEndSlash = false;
      break;
    default:
      buffer.append(letter);
    }
  }
  
  r += buffer.toMatch(params, optonalEndSlash) + (optonalEndSlash ? "\\/?\\??$/" : "\\??$/");
  return {'route': r, 'params': params};
}
  
  
/**
 * Takes a pre-compiled path and splits out all the different paths.
 * @api private
 * @private
 *
 * @param {String} The path to derive branches from
 * @returns The different derived paths.
 * @type Array
 */
function deriveBranches(path, paths) {
  paths = paths || [];
  var match = extract(path);
  
  if (!match) {
    paths.push(path)
    return paths;
  }
  
  var pre  = match[0] || "";
  var opt  = match[1] || "";
  var post = match[2] || "";
  
  deriveBranches(pre + post, paths);
  deriveBranches(pre + opt + post, paths);
  
  return paths;
}


/**
 * An internal class to buffer the path as we walk through it.
 * @api private
 * @private
 */
function PathBuffer() {
  var buffer = "";
  var match_id = 1;

  this.toMatch = function(params, useSeparator) {
    useSeparator = (useSeparator === false) ? false : true;
    var b = buffer;
    this.flush();
    if (b[0] == ":") {
      params[b.substring(1)] = match_id++;
      return useSeparator ? "([^/;.]+)" : "(.+)";
    } else {
      return b;
    }
  }

  this.append = function(str) {
    buffer += str;
  }

  this.flush = function() {
    buffer = "";
  }
}

// FIXME: Warning not so good implementation!
function extract(str, index, stack, buffer, pre, inc, post) {
  index = index || 0;
  stack = stack || -1;
  buffer = buffer || "";
  pre = pre || "";
  inc = inc || "";
  post = post || "";
  
  if (index >= str.length)
    return null;
  var c = str[index];
  switch(c) {
  case "(":
    if (stack == -1)
      return extract(str, ++index, 1, "", buffer);
    else
      return extract(str, ++index, ++stack, buffer + "(", pre);
    break;
  case ")":
    stack--;
    if (stack == 0)
      return [pre, buffer, str.substring(++index)];
    else
      return extract(str, ++index, stack, buffer + ")", pre);
  default:
    return extract(str, ++index, stack, buffer + c, pre);
  }
}

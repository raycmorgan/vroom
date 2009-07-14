
/**
 * Parses a raw Query String into an Object
 * @api public
 *
 * @param {String} q The query string to parse
 * @returns An Object representing the query string
 * @type Object
 */

function parse(q) {
  var params = {};
  var chunks = q.split("&");
  for (var i = 0; i < chunks.length; i++) {
    var chunk = chunks[i];
    var kv = chunk.split("=");
    var key = kv[0];
    var value = kv[1];

    var key = key.replace(/\]/g, "").split("[");
    var level = params;
    for (var ii = 0; ii < key.length-1; ii++) {
      if (level instanceof Array) {
        if (key[ii+1] != "") {
          var obj = {};
          level.push(obj);
          level = obj;
        } else {
          var arr = [];
          level.push(arr);
          level = arr;
        }
      } else {
        if (key[ii+1] != "") {
          level[key[ii]] = level[key[ii]] || {};
          level = level[key[ii]];
        } else {
          level[key[ii]] = level[key[ii]] || [];
          level = level[key[ii]];
        }
      }
    }
    key = key[key.length-1];
    if (key == "")
      level.push(value);
    else
      level[key] = value;
  }
  
  return params;
}
exports.parse = parse;


/**
 * Encodes an Object into a query string
 * @unimplemented
 * @ignore
 *
 * @param {Object} params The Object to encode
 * @returns A query string
 * @type String
 */
function encode() {
  throw("Not Implemented");
  
  var qs = "";    
  return qs;
}
exports.encode = encode;
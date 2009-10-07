exports.handlers = {
  404: function () {
    return "[404] Oops.. the URL was not found.";
  },
  
  500: function () {
    return "[500] Well, that didn't work. Sorry about that.";
  }
}
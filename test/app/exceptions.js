exports.handlers = {
  404: function (e) {
    logError(this, e);
    return "[404] Oops.. the URL was not found.";
  },
  
  500: function (e) {
    logError(this, e);
    return "[500] Well, that didn't work. Sorry about that.";
  }
}

function logError(request, e) {
  if (e.stack) {
    request.LOG.error(request.path + "\n" + e.stack + "\n");
  } else if (e.message) {
    request.LOG.error(request.path + " -- " + e.message);
  } else {
    request.LOG.error(request.path + "--" + JSON.stringify(e));
  }
}

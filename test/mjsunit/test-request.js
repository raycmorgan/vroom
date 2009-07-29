include("mjsunit.js");
var Request = require("../../lib/vroom/request.js");
var MockReq = require("mock/mock-req.js");
var MockRes = require("mock/mock-res.js");

var sendHeaderCalled = false;
var sendBodyCalled = false;
var finishCalled = false;

function assertMatch(o1, o2) {
  assertEquals(JSON.stringify(o1), JSON.stringify(o2));
}

function onLoad() {
  var req = MockReq.mock({query: "page=2&name=ray", method: 'POST'});
  var res = MockRes.mock({
    sendHeader: function(status, header) {
      assertEquals(200, status);
      assertEquals([['Content-Type', 'text/html']], header);
      sendHeaderCalled = true;
    },
    sendBody: function(str) {
      assertEquals("Hello World", str);
      sendBodyCalled = true;
    },
    finish: function() { finishCalled = true; }
  });
  var request = Request.createRequest({}, req, res);
  
  
  assertMatch(request.params, {page: '2', name: 'ray'});
  assertEquals(request.method, 'POST');
  
  request.captured = {"foo": "bar"};
  assertEquals("bar", request.captured.foo);
  
  request.status = 200;
  request.addHeader("Content-Type", "text/html");
  request.addHeader("Remove-Me", "bad");
  request.removeHeader("Remove-Me"); // to test removing the header.
  request.sendHeader();
  
  request.write("Hello World");
  
  request.finish();
  assertTrue(request.finished, "request.finished");
}

function onExit() {
  assertTrue(sendHeaderCalled, "sendHeaderCalled");
  assertTrue(sendBodyCalled, "sendBodyCalled");
  assertTrue(finishCalled, "finishCalled");
}

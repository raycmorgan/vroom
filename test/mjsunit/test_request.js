var helpers = require("../test_helpers.js");
var assertMatch = helpers.assertMatch;

// Setup the Mocks
var MockReq = require("mock/req.js");
var MockRes = require("mock/res.js");

exports.beforeEach = function () {
  if (Vroom) {
    var fullpath = node.path.join(node.path.dirname(__filename), "../../lib/vroom.js");
    
    delete Vroom;
    delete node.Module.cache[fullpath];
    require('../../lib/vroom.js');
  }
  
  this.req = MockReq.mock({
    path: "/people",
    query: "page=2&name=ray",
    params: {page: '2', name: 'ray'},
    method: 'HEAD',
    host: 'localhost'
  });
  this.res = MockRes.mock();
  this.request = new Vroom.Request({}, this.req, this.res);
};


exports.tests = [

  function test_param() {
    assertMatch({page: '2', name: 'ray'}, this.request.params);
  },
  
  function test_method() {
    assertMatch('GET', this.request.method);
  },
  
  function test_actualMethod() {
    assertMatch('HEAD', this.request.actualMethod);
  },
  
  function test_path() {
    assertMatch('/people', this.request.path);
  },
  
  function test_protocol() {
    assertMatch('http', this.request.protocol);
  },
  
  function test_host() {
    assertMatch('localhost', this.request.host);
  },
  
  function test_status() {
    assertMatch(null, this.request.status);
    this.request.status = "500";
    assertMatch(500, this.request.status);
    this.request.status = 200;
    assertMatch(200, this.request.status);
  },
  
  function test_header() {
    assertMatch([], this.request.header);
    this.request.addHeader('Content-Type', 'text/html');
    assertMatch([['Content-Type', 'text/html']], this.request.header);
    this.request.removeHeader('Content-Type');
    assertMatch([], this.request.header);
  },
  
  function test_sendHeader() {
    var resSendHeaderCalled = false;
    this.res.sendHeader = function (status, header) {
      assertMatch(200, status);
      assertMatch([['Content-Type', 'text/html']], header);
      resSendHeaderCalled = true;
    };
    
    this.request.status = 200;
    this.request.addHeader('Content-Type', 'text/html');
    this.request.sendHeader();
    assertMatch(true, this.request.hasSentHeader);
    
    return function () {
      assertMatch(true, resSendHeaderCalled);
    }
  },
  
  function test_write() {
    var resSendBodyCalled = false;
    this.res.sendBody = function (str) {
      assertMatch("Hello World", str);
      resSendBodyCalled = true;
    };
    
    this.request.sendHeader();
    this.request.write("Hello World");
    
    return function () {
      assertMatch(true, resSendBodyCalled);
    };
  },
  
  function test_finish() {
    this.request.sendHeader();
    this.request.finish();
    assertTrue(true, this.request.finished);
  }
  
];

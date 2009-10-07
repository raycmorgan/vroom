var helpers = require("../test_helpers.js");
var assertMatch = helpers.assertMatch;

var MockReq = require("mock/req.js");
var MockRes = require("mock/res.js");
var MockLog = require("mock/logger.js");

exports.beforeEach = function () {
  if (Vroom) {
    var fullpath = node.path.join(node.path.dirname(__filename), "../../lib/vroom.js");
    
    delete Vroom;
    delete node.Module.cache[fullpath];
    require('../../lib/vroom.js');
  }
  
  this.req = MockReq.mock();
  this.res = MockRes.mock();
  this.request = new Vroom.Request({LOG: MockLog.mock()}, this.req, this.res);
};

exports.tests = [
  function test_captured() {
    var resource = new Vroom.PathResource(function () { with (this) {
      get("/:name/:id", function (id, name) {        
        assertMatch("ray", name);
        assertMatch("ray", this.captured.name);
        assertMatch("12", id);
        assertMatch("12", this.captured.id);
      });
    }});
    
    this.req.method = 'GET';
    this.req.uri.path = "/ray/12";
    
    var fun = resource.compile("/", {LOG: MockLog.mock()});
    fun.call(this.request);
  },
  
  function test_routes() {
    var resource = new Vroom.PathResource(function () { with (this) {
      get("/", function () {
        return "/";
      });
      
      get("/:id", function () {
        return "/:id";
      });
      
      get("/post/:year(/:month(/:day))", function (year, month, day) {
        if (day)
          return "/post/:year/:month/:day";
        else if (month)
          return "/post/:year/:month";
        else
          return "/post/:year";
      });
    }});
    
    this.req.method = 'GET';
    var fun = resource.compile("/", {LOG: MockLog.mock()});
    
    this.req.uri.path = "/";
    assertMatch("/", fun.call(this.request));
    
    this.req.uri.path = "/12";
    assertMatch("/:id", fun.call(this.request));
    
    this.req.uri.path = "/post/2008";
    assertMatch("/post/:year", fun.call(this.request));
    
    this.req.uri.path = "/post/2008/11";
    assertMatch("/post/:year/:month", fun.call(this.request));
    
    this.req.uri.path = "/post/2008/11/1";
    assertMatch("/post/:year/:month/:day", fun.call(this.request));
  }
];

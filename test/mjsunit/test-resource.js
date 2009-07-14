include("mjsunit.js");
var Resource = require("../../lib/juice/resource.js");
var Request = require("../../lib/juice/request.js");
var MockReq = require("mock/mock-req.js");
var MockRes = require("mock/mock-res.js");

function onLoad() {
  var req = MockReq.mock();
  var res = MockRes.mock();
  var request = Request.createRequest({}, req, res);
  
  var resource = Resource.createResource(function() {
    this.get("/", function() {
      return "/";
    });
    
    this.get("/:id", function() {
      assertEquals(12, this.captured.id);
      return "/:id";
    });
  });
  
  assertEquals("/", resource.routeFor['GET']("/", request));
  assertEquals("/:id", resource.routeFor['GET']("/12", request));
  
  var resource = Resource.createResource(function() {
    this.get("/", function() {
      return "/";
    });
    
    this.get("/:id", function(id) {
      assertEquals(12, this.captured.id);
      assertEquals(12, id);
      return "/:id";
    });
  }, "/post");
    
  assertEquals("/", resource.routeFor['GET']("/post", request));
  assertEquals("/:id", resource.routeFor['GET']("/post/12", request));
}

include("mjsunit.js");
var Resource = require("../../lib/juice/dispatch/resource.js");
var Request = require("../../lib/juice/dispatch/request.js");
var MockReq = require("mock/mock-req.js");
var MockRes = require("mock/mock-res.js");

var _id1 = null;
var _id2 = null;

function onLoad() {
  var req = MockReq.mock();
  var res = MockRes.mock();
  var request = Request.createRequest({}, req, res);
  
  var resource = Resource.createResource(function() {
    this.get("/", function() {
      return "/";
    });
    
    this.get("/post/:id", function() {
      _id1 = null;
      node.debug(JSON.stringify(this.captured));
      return "/post/:id";
    });
  });
  
  assertEquals("/", resource.routeFor['GET']("/", request));
  assertEquals("/post/:id", resource.routeFor['GET']("/post/12", request));
  
  var resource = Resource.createResource(function() {
    this.get("/", function() {
      return "/";
    });
    
    this.get("/:id", function() {
      
      return "/:id";
    });
  }, "/post");
    
  assertEquals("/", resource.routeFor['GET']("/post", request));
  assertEquals("/:id", resource.routeFor['GET']("/post/12", request));
}

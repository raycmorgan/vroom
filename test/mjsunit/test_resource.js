// include("mjsunit.js");
// var Resource = require("../../lib/vroom/resource.js");
// var Request = require("../../lib/vroom/request.js");
// var MockReq = require("mock/mock-req.js");
// var MockRes = require("mock/mock-res.js");
// 
// function onLoad() {
//   var req = MockReq.mock();
//   var res = MockRes.mock();
//   var request = Request.createRequest({}, req, res);
//   
//   var resource = Resource.createResource(function() {
//     get("/", function() {
//       return "/";
//     });
//     
//     get("/:id", function() {
//       assertEquals(12, captured.id);
//       return "/:id";
//     });
//   });
//   
//   assertEquals("/", resource.routeFor['GET']("/", request), "/");
//   assertEquals("/:id", resource.routeFor['GET']("/12", request), "/:id");
//   
//   var resource = Resource.createResource(function() {
//     get("/", function() {
//       return "/";
//     });
//     
//     get("/:id", function(id) {
//       assertEquals(12, captured.id);
//       assertEquals(12, id);
//       return "/:id";
//     });
//   }, "/post");
//     
//   assertEquals("/", resource.routeFor['GET']("/post", request), "/ mounted at /post");
//   assertEquals("/:id", resource.routeFor['GET']("/post/12", request), "/:id mounted at /post");
// }
// 
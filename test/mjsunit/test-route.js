include("mjsunit.js");
var Route = require("../../lib/juice/route.js");

function onLoad() {  
  var routeMap = [
    { route: "/", compiled: [{route: "/^\\/?\\??$/", params: []}] },
    { route: "/post", compiled: [{route: "/^\\/post\\/?\\??$/", params: []}] },
    { route: "/post/:id", compiled: [
      {route: "/^\\/post\\/([^/;.]+)\\/?\\??$/", params: ["id"]}
    ]},
    { route: "/post/:id.:format", compiled: [
      {route: "/^\\/post\\/([^/;.]+)\\.(.+)\\??$/", params: ["id", "format"]}
    ]},
    { route: "/post/:year(/:month)", compiled: [
      {route: "/^\\/post\\/([^/;.]+)\\/?\\??$/", params: ["year"]},
      {route: "/^\\/post\\/([^/;.]+)\\/([^/;.]+)\\/?\\??$/", params: ["year", "month"]}
    ]}
  ];
  
  routeMap.forEach(function(r) {
    assertEquals(
      JSON.stringify(Route.compile(r.route)),
      JSON.stringify(r.compiled));
  });
}

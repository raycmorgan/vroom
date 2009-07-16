include("mjsunit.js");
var Route = require("../../lib/vroom/route.js");

function onLoad() {  
  var routeMap = [
    { route: "/", compiled: [{route: "/^\\/?\\??$/", params: {}}] },
    { route: "/post", compiled: [{route: "/^\\/post\\/?\\??$/", params: {}}] },
    { route: "/post/:id", compiled: [
      {route: "/^\\/post\\/([^/;.]+)\\/?\\??$/", params: {id: 1}}
    ]},
    { route: "/post/:id.:format", compiled: [
      {route: "/^\\/post\\/([^/;.]+)\\.(.+)\\??$/", params: {id: 1, format: 2}}
    ]},
    { route: "/post/:year(/:month)", compiled: [
      {route: "/^\\/post\\/([^/;.]+)\\/?\\??$/", params: {year: 1}},
      {route: "/^\\/post\\/([^/;.]+)\\/([^/;.]+)\\/?\\??$/", params: {year: 1, month:2 }}
    ]}
  ];
  
  routeMap.forEach(function(r) {
    assertEquals(
      JSON.stringify(r.compiled),
      JSON.stringify(Route.compile(r.route)));
  });
}

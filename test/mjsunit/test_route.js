var helpers = require("../test_helpers.js");
var assertMatch = helpers.assertMatch;

var Route = require("../../lib/vroom/path_resource/route.js");

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
  assertMatch(r.compiled, Route.compile(r.route));
});

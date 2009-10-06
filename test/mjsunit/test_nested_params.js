var helpers = require('../test_helpers.js');
var params = require("../../lib/vroom/plugin/nested_params.js");

var matchMap = [
  [ "foo=bar", {foo: 'bar'} ],
  [ "foo=bar&baz=zap", {foo: 'bar', baz: 'zap'} ],
  [ "foo=bar&baz[]=goo&baz[]=far", {foo: 'bar', baz: ['goo', 'far']} ],
  [ "foo=bar&baz[]=goo&baz[]=far&name=jim", {foo: 'bar', baz: ['goo', 'far'], name: 'jim'} ],
  [ "foo=bar&person[name]=jim&person[age]=23", {foo: 'bar', person: {name: 'jim', age: '23'}} ]
];

for (var i = 0; i < matchMap.length; i++)
  helpers.assertMatch(params.parse(matchMap[i][0]), matchMap[i][1]);

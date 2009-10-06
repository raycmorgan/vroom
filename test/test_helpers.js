node.mixin(require("/mjsunit.js"));

exports.assertMatch = function assertMatch(o1, o2) {
  assertEquals(
    JSON.stringify(o1),
    JSON.stringify(o2)
  );
}

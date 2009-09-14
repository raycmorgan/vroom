require("../lib/vroom.js");

(function() {
  exports.assertMatch = function assertMatch(o1, o2) {
    assertEquals(
      JSON.stringify(o1),
      JSON.stringify(o2)
    );
  }
})();

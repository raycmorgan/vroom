exports[404] = function() {
  this.write("Sorry... The resource was not found.");
  this.finish();
}
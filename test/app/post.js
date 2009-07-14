exports.resource = function() {
  this.get("/", function() {
    this.status = 200;
    this.sendHeader();
    
    this.puts("Hello World");
    
    this.finish();
  })
}

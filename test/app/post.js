exports.resource = function() {
  // var LOG = this.application.logger;
  
  this.get("/", function() {
    this.application.LOG.info("Handling / request post.js");
    this.status = 200;
    this.sendHeader();
    
    this.puts("Hello World");
    
    this.finish();
  });
  
  this.get("/:id", function(id) {
    this.status = 200;
    this.sendHeader();
    
    this.puts("You are looking for the id: " + id);
    
    this.finish();
  });
  
  this.get("/by-date/:year(/:month(/:day))", function(year, month, day) {
    this.status = 200;
    this.sendHeader();
    
    this.puts("You are looking by the date: " + year + "/" + (month || "??") + "/" + (day || "??"));
    
    this.finish();
  });
}

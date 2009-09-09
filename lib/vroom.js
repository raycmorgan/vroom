// We are going to litter the global namespace with
// this one variable. Hopefully we will get rid of
// it later...
if (typeof(Vroom) == "object") {
  exports.Vroom = Vroom;
} else {
  Vroom = {}
  Vroom = require('vroom/loader.js');
  
  exports.Vroom = Vroom;
  exports.Vroom.version = "0.5";
  exports.Vroom.PASS = "Vroom.PASS";
  
  Vroom.Aspect(Vroom.Application);
}

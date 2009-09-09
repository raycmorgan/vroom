if (!Vroom)
  throw "Vroom must be required first.";

// Vroom.Application.after('initialize', function() {
//   this.magicScope = false;
// });
Vroom.Config.addOption('magicScope', "Adds a 'with (this)' around the resource functions.", ['true', 'false']);

Vroom.Application.on('mount', function(resource) {
  if (this.config.magicScope)
    resource = eval(resource.toString().replace(/\{/, "{ with(this) {") + "}");
  return [resource];
});

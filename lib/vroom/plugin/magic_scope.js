if (!Vroom)
  throw "Vroom must be required first.";

Vroom.Config.addOption('magicScope', "Adds a 'with (this)' around the resource functions.", ['false', 'true']);

Vroom.PathResource.on('before_compiling_callback', function (resource) {
  if (this.application.config.magicScope)
    resource = resource.toString().replace(/\{/, "{ with(this) {") + "}";
  return [resource];
});

Vroom.PathResource.on('after_compile', function (resource) {
  resource.disallowMagicScope = true;
  return [resource];
});

Vroom.Application.on('before_mounting_resource', function (resource) {
  if (this.config.magicScope && !resource.disallowMagicScope)
    resource = eval(resource.toString().replace(/\{/, "{ with(this) {") + "}");
  return [resource];
});

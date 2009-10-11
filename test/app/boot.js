var Vroom = require('../../lib/vroom.js');
Vroom.installPlugin(require('../../lib/vroom/plugin/ejs.js'));


var app = new Vroom.Application();

Vroom.Config.printOptions();

app.config.use(function (c) {
  c['viewDir'] = node.path.dirname(__filename);
  c['reloadTemplates'] = true;
});


var root = require('root.js');
var posts = require('posts.js');
var exceptions = require('exceptions.js');

app.mount('root', '/', root);
app.mount('posts', '/posts', posts);

app.mount('users', /\/users\/(.+)\/?/, function (name) {
  return "Users: " + name;
});

app.mountExceptionHandler(exceptions);

app.boot({port: 8000});

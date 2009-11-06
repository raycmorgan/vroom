var path  = require('path');
var Vroom = require('../../lib/vroom');
Vroom.installPlugin(require('../../lib/vroom/plugin/ejs'));


var app = new Vroom.Application();

Vroom.Config.printOptions();

app.config.use(function (c) {
  c['viewDir'] = path.dirname(__filename);
  c['reloadTemplates'] = true;
});


var root = require('./root');
var posts = require('./posts');
var exceptions = require('./exceptions');

app.mount('root', '/', root);
app.mount('posts', '/posts', posts);

app.mount('users', /^\/users\/([^\/]+)\/?$/, function (name) {
  return "Users: " + name;
});

app.mountExceptionHandler(exceptions);

app.boot({port: 8000});

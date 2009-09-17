Vroom - A simple resource web framework for Node.js
===================================================

Vroom's goals are to be an easy to use web framework
for building scalable HTTP oriented applications.


### Core Goals

    * Do NOT mess with Node.js's ability to stream data.
    * Work with the async nature of Node.js, not against.
    * Have a simple API (a little magic is fine!)
    * Have a simple core.

While I feel that these goals are currently met to certain
degrees, I believe there is still a bunch of work to do to
fully meet each goal.


### Routing

Routing is provided by the individual resource type. Each resource
type is built upon the Application mounting system built into
Vroom. A default PathResource is included and provides a very
flexible routing system based on Sinatra + Merb style routing.


### Usage

For a demo app see: `test/app/`

Here is a totally simple example app

    require("lib/vroom.js");

    var resource = new Vroom.PathResource(function () { with (this) {
  
      get('/', function () {
        return "Hello World";
      });
  
      get('/person(/:name)', function (name) {
        return "Hello: " + (name || "unknown");
      });
  
      get('/stream', function () {
        this.status = 200;
        this.write("Hello ");
        this.write("World!");
        this.finish()
      });
  
    }});

    var app = new Vroom.Application();

    app.config.use(function (c) {
      c['logLevel'] = 'DEBUG';
    });

    app.mount('root', '/', resource);
    app.boot();

Since the config/mounting/booting/etc is separate from the
resources, each piece can be in its own file as you see fit.
See the test/app for a more detailed example with templates
and such.

To boot that:

    $ node that-file.js

Note that you need [Node.js](http://tinyclouds.org/node/) installed
prior to running the application.


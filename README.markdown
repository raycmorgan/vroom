Juice - A simple resource web framework for Node.js
===================================================

Juice's goals are to be an easy to use web framework
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

Routing is achieved by a mix of pure path based routing
(i.e. Sinatra) and a simple mounting approach.


### Usage

For a demo app see: `test/app/`

Here is a totally simple example app

    var Juice = require("lib/juice.js");

    var resource = function() {
      get("/(:name)", function(name) {
        puts("Hello: " + (name || "unknown"));
        finish();
      });
    }

    function onLoad() {
      // Create a new Application
      var app = Juice.createApp();

      // This is were we mount our resource from above
      // we are going to mount this on "/"
      app.mount("/", resource);

      // Finally we start the application up
      app.boot();
    }

Since the onLoad (mounting/booting/etc) is separate from
the resources, this can (and usually is) be in its own
file. See the test/app for a more detailed example with
templates and such.


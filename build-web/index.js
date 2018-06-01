var express = require('express');
var next = require('next');
var env = require('../lib/env');

// setup Next.js app
var dev = process.env.NODE_ENV !== 'production';
var app = next({ dev: dev });
var handle = app.getRequestHandler();

app.prepare().then(function () {
  var server = express();

  // default request handler
  server.get('*', handle);

  // start server
  server.listen(env.WEB_PORT, function (err) {
    if (err) throw err;
    console.log('> Web at http://localhost:' + env.WEB_PORT);
  });
}).catch(function (ex) {
  console.error(ex.stack);
  process.exit(1);
});
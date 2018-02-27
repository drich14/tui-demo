const express = require('express');
const next = require('next');
const env = require('../lib/env');

// setup Next.js app
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    // default request handler
    server.get('*', handle);

    // start server
    server.listen(env.WEB_PORT, err => {
      if (err) throw err;
      console.log(`> Web at http://localhost:${env.WEB_PORT}`);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });

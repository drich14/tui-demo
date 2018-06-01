var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var env = require('../lib/env');

var _require = require('graphql-yoga'),
    GraphQLServer = _require.GraphQLServer;

var _require2 = require('graphql-import'),
    importSchema = _require2.importSchema;

var _require3 = require('prisma-binding'),
    Prisma = _require3.Prisma;

var _require4 = require('./auth'),
    me = _require4.me,
    signup = _require4.signup,
    login = _require4.login;

var _require5 = require('./schema'),
    getSchema = _require5.getSchema;

var resolvers = {
  Query: {
    me: me,
    getSchema: getSchema
  },
  Mutation: {
    signup: signup,
    login: login
  }
};

var server = new GraphQLServer({
  typeDefs: 'api/schema.graphql',
  resolvers: resolvers,
  context: function context(req) {
    return _extends({}, req, {
      db: new Prisma({
        typeDefs: 'database/prisma.graphql', // points to Prisma database schema
        endpoint: env.DB_ENDPOINT, // Prisma service endpoint (see `~/.prisma/config.yml`)
        secret: env.DB_SECRET, // `secret` taken from `prisma.yml`
        debug: true // log all requests to the Prisma API to console
      })
    });
  }
});

server.start(function () {
  return console.log('> API at ' + env.API_ENDPOINT + '\n> DB at ' + env.DB_ENDPOINT);
});
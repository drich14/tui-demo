const env = require('../lib/env');
const { GraphQLServer } = require('graphql-yoga');
const { importSchema } = require('graphql-import');
const { Prisma } = require('prisma-binding');
const { me, signup, login } = require('./auth');

const resolvers = {
  Query: {
    me
  },
  Mutation: {
    signup,
    login
  }
};

const server = new GraphQLServer({
  typeDefs: 'server/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'database/prisma.graphql', // points to Prisma database schema
      endpoint: env.DB_ENDPOINT, // Prisma service endpoint (see `~/.prisma/config.yml`)
      secret: env.DB_SECRET, // `secret` taken from `prisma.yml`
      debug: true // log all requests to the Prisma API to console
    })
  })
});

server.start(() => console.log(`API at ${env.API_ENDPOINT}`));

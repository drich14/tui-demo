const yaml = require('write-yaml');
const fs = require('fs');
require('dotenv').config();

const vars = {
  APP: null,
  SECRET: null,
  WEB_PORT: 3000,
  WEB_ENDPOINT: ['$WEB_PORT', wp => `http://localhost:${wp}`],
  API_SECRET: '$SECRET',
  API_PORT: 4000,
  API_ENDPOINT: ['$API_PORT', ap => `http://localhost:${ap}`],
  DB_STAGE: 'dev',
  DB_CLUSTER: 'local',
  DB_SERVICE: '$APP',
  DB_SECRET: '$SECRET',
  DB_PORT: 4466,
  DB_ENDPOINT: [
    '$DB_PORT',
    '$DB_SERVICE',
    '$DB_STAGE',
    (dp, dse, dst) => `http://localhost:${dp}/${dse}/${dst}`
  ],
  COOKIE_TOKEN: 'token',
  COOKIE_USER_ID: 'user_id'
};

const getVar = (vars, v) => {
  if (!process.env[v]) {
    const val = vars[v];
    if (val !== null) {
      if (Array.isArray(val))
        return val.pop()(...val.map(a => getVar(vars, a.substr(1))));
      if (typeof val === 'string' && val.substr(1) in vars)
        return getVar(vars, val.substr(1));
      return val;
    }
    throw `Missing ${v} in .env.`;
  }
  return process.env[v];
};

for (v in vars) {
  process.env[v] = getVar(vars, v);
}

const graphqlConfig = {
  projects: {
    app: {
      schemaPath: 'server/schema.graphql',
      extensions: {
        endpoints: {
          default: process.env.API_ENDPOINT
        }
      }
    },
    database: {
      schemaPath: 'database/prisma.graphql',
      extensions: {
        prisma: 'database/prisma.yml'
      }
    }
  }
};

const prismaConfig = {
  service: process.env.DB_SERVICE,
  stage: process.env.DB_STAGE,
  cluster: process.env.DB_CLUSTER,
  secret: process.env.DB_SECRET || process.env.SECRET,
  datamodel: 'datamodel.graphql'
};

// TODO docker compose config

const logError = e => (e ? console.error(e) : null);

yaml('.graphqlconfig.yml', graphqlConfig, logError);
yaml('database/prisma.yml', prismaConfig, logError);

const envStr = `exports = module.exports = ${JSON.stringify(process.env)}`;
fs.writeFile('lib/env.js', envStr, 'utf8', logError);

const yaml = require('write-yaml');
const fs = require('fs');
require('dotenv').config();

const vars = {
  APP: null,
  SECRET: null,
  WEB_PORT: 3000,
  WEB_ENDPOINT: ['WEB_PORT', WEB_PORT => `http://localhost:${WEB_PORT}`],
  API_SECRET: 'SECRET',
  API_PORT: 4000,
  API_ENDPOINT: ['API_PORT', API_PORT => `http://localhost:${API_PORT}`],
  DB_STAGE: 'dev',
  DB_CLUSTER: 'local',
  DB_SERVICE: 'APP',
  DB_SECRET: 'SECRET',
  DB_PORT: 4466,
  DB_ENDPOINT: [
    'DB_PORT',
    'DB_SERVICE',
    'DB_STAGE',
    (DB_PORT, DB_SERVICE, DB_STAGE) =>
      `http://localhost:${DB_PORT}/${DB_SERVICE}/${DB_STAGE}`
  ]
};

const getVar = (vars, v) => {
  if (!process.env[v]) {
    const val = vars[v];
    if (val !== null) {
      if (Array.isArray(val))
        return val.pop()(...val.map(a => getVar(vars, a)));
      if (val in vars) return getVar(vars, vars[v]);
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

const logError = e => (e ? console.error(e) : null);

yaml('.graphqlconfig.yml', graphqlConfig, logError);
yaml('database/prisma.yml', prismaConfig, logError);

const envStr = `exports = module.exports = ${JSON.stringify(process.env)}`;
fs.writeFile('lib/env.js', envStr, 'utf8', logError);

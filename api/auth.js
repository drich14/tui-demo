const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Context, getUserId } = require('./utils');
const env = require('../lib/env');

// query the currently logged in user
const me = (parent, args, ctx, info) => {
  const id = getUserId(ctx);
  return ctx.db.query.user({ where: { id } }, info);
};

// register a new user
const signup = async (parent, args, ctx, info) => {
  const password = await bcrypt.hash(args.password, 10);
  const user = await ctx.db.mutation.createUser({
    data: { ...args, password }
  });

  return {
    token: jwt.sign({ userId: user.id }, env.API_SECRET),
    user
  };
};

// log in an existing user
const login = async (parent, { email, password }, ctx, info) => {
  const user = await ctx.db.query.user({ where: { email } });
  if (!user) {
    throw new Error(`No user found for email: ${email}`);
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error('Invalid password');
  }

  return {
    token: jwt.sign({ userId: user.id }, env.API_SECRET),
    user
  };
};

module.exports = { me, signup, login };

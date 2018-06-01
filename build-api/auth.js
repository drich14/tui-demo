import _regeneratorRuntime from 'babel-runtime/regenerator';

var _this = this;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var _require = require('./utils'),
    Context = _require.Context,
    getUserId = _require.getUserId;

var env = require('../lib/env');

// query the currently logged in user
var me = function me(parent, args, ctx, info) {
  var id = getUserId(ctx);
  return ctx.db.query.user({ where: { id: id } }, info);
};

// register a new user
var signup = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(parent, args, ctx, info) {
    var password, user;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return bcrypt.hash(args.password, 10);

          case 2:
            password = _context.sent;
            _context.next = 5;
            return ctx.db.mutation.createUser({
              data: _extends({}, args, { password: password })
            });

          case 5:
            user = _context.sent;
            return _context.abrupt('return', {
              token: jwt.sign({ userId: user.id }, env.API_SECRET),
              user: user
            });

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this);
  }));

  return function signup(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

// log in an existing user
var login = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(parent, _ref2, ctx, info) {
    var email = _ref2.email,
        password = _ref2.password;
    var user, valid;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return ctx.db.query.user({ where: { email: email } });

          case 2:
            user = _context2.sent;

            if (user) {
              _context2.next = 5;
              break;
            }

            throw new Error('No user found for email: ' + email);

          case 5:
            _context2.next = 7;
            return bcrypt.compare(password, user.password);

          case 7:
            valid = _context2.sent;

            if (valid) {
              _context2.next = 10;
              break;
            }

            throw new Error('Invalid password');

          case 10:
            return _context2.abrupt('return', {
              token: jwt.sign({ userId: user.id }, env.API_SECRET),
              user: user
            });

          case 11:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, _this);
  }));

  return function login(_x5, _x6, _x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}();

module.exports = { me: me, signup: signup, login: login };
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var jwt = require('jsonwebtoken');

var _require = require('prisma-binding'),
    Prisma = _require.Prisma;

var env = require('../lib/env');

function getUserId(ctx) {
  var Authorization = ctx.request.get('Authorization');
  if (Authorization) {
    var token = Authorization.replace('Bearer ', '');

    var _jwt$verify = jwt.verify(token, env.API_SECRET),
        userId = _jwt$verify.userId;

    return userId;
  }

  throw new AuthError();
}

var AuthError = function (_Error) {
  _inherits(AuthError, _Error);

  function AuthError() {
    _classCallCheck(this, AuthError);

    return _possibleConstructorReturn(this, (AuthError.__proto__ || Object.getPrototypeOf(AuthError)).call(this, 'Not authorized'));
  }

  return AuthError;
}(Error);

module.exports = { getUserId: getUserId, AuthError: AuthError };
const jwt = require('jsonwebtoken');

const Error401 = require('../errors/error-401');

const { ERR_401 } = require('../utils/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new Error401(ERR_401));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return next(new Error401(ERR_401));
  }

  req.user = payload;

  return next();
};

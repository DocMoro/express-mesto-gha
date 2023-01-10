const jwt = require('jsonwebtoken');

const ERR_401 = 'Необходима авторизация';

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: ERR_401 });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res
      .status(401)
      .send({ message: ERR_401 });
  }

  req.user = payload;

  next();

  return;
};

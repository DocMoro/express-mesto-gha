const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const Error404 = require('../errors/error-404');
const Error401 = require('../errors/error-401');
const Error400 = require('../errors/error-400');

const ERR_404 = 'Ресурс по запрашиваемому _id не найден';
const ERR_401 = 'Неправильные почта или пароль';
const ERR_400 = 'Переданы некорректные данные';

module.exports.getUserProfile = (req, res) => {
  User.findOne(req.user._id)
    .then((user) => {
      if (!user) {
        throw new Error404(ERR_404);
      }

      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new Error400(ERR_400));
      }

      next(err);
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new Error404(ERR_404);
      }

      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new Error400(ERR_400));
      }

      next(err);
    });
};

module.exports.createUser = (req, res) => {
  const { password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        ...req.body,
        password: hash,
      });
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new Error400(ERR_400));
      }

      next(err);
    });
};

module.exports.updateUser = (req, res) => {
  const { _id } = req.user;

  if (req.body.avatar) {
    next(new Error400(ERR_400));
  }

  User.findByIdAndUpdate(_id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new Error400(ERR_400));
      }

      next(err);
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { _id } = req.user;

  if (req.body.name || req.body.link) {
    next(new Error400(ERR_400));
  }

  User.findByIdAndUpdate(_id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new Error400(ERR_400));
      }

      next(err);
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key');

      res.send({ token });
    })
    .catch(() => next(new Error401(ERR_401)));
};

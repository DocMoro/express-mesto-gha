const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const Error404 = require('../errors/error-404');
const Error401 = require('../errors/error-401');
const Error400 = require('../errors/error-400');
const Error409 = require('../errors/error-409');

const { ERR_404, ERR_400, ERR_401, ERR_409 } = require('../utils/constants');

module.exports.getUserProfile = (req, res, next) => {
  User.findById(req.user._id)
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

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.getUserId = (req, res, next) => {
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

module.exports.createUser = (req, res, next) => {
  const { password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      ...req.body,
      password: hash,
    }))
    .then((user) => res.send({
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new Error400(ERR_400));
      }

      if (err.code === 11000) {
        next(new Error409(ERR_409));
      }

      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
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

module.exports.updateUserAvatar = (req, res, next) => {
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

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key');

      res.send({ token });
    })
    .catch(() => next(new Error401(ERR_401)));
};

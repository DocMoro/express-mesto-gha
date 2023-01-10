const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const ERR_500 = 'На сервере произошла ошибка';
const ERR_404 = 'Ресурс по запрашиваемому _id не найден';
const ERR_400 = 'Переданы некорректные данные';

module.exports.getUserProfile = (req, res) => {
  User.findOne(req.user._id)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: ERR_404 });
        return;
      }

      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: ERR_400 });
        return;
      }

      res.status(500).send(req.user._id);
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: ERR_500 }));
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: ERR_404 });
        return;
      }

      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: ERR_400 });
        return;
      }

      res.status(500).send({ message: ERR_500 });
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
        res.status(400).send({ message: ERR_400 });
        return;
      }

      res.status(500).send({ message: ERR_500 });
    });
};

module.exports.updateUser = (req, res) => {
  const { _id } = req.user;

  if (req.body.avatar) {
    res.status(400).send({ message: ERR_400 });
    return;
  }

  User.findByIdAndUpdate(_id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: ERR_400 });
        return;
      }

      res.status(500).send({ message: ERR_500 });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { _id } = req.user;

  if (req.body.name || req.body.link) {
    res.status(400).send({ message: ERR_400 });
    return;
  }

  User.findByIdAndUpdate(_id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: ERR_400 });
        return;
      }

      res.status(500).send({ message: ERR_500 });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key');

      res.send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

const User = require('../models/user');

const ERR_500 = 'На сервере произошла ошибка';
const ERR_404 = 'Ресурс по запрашиваемому _id не найден';
const ERR_400 = 'Переданы некорректные данные';

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
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
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

const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send(user))
    .catch((err) => res.status(400).send({ message: `Произошла ошибка ${err}` }));
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send(user))
    .catch((err) => res.status(400).send({ message: `Произошла ошибка ${err}` }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => res.status(400).send({ message: `Произошла ошибка ${err}` }));
};

module.exports.updateUser = (req, res) => {
  const { _id } = req.user;

  if (req.body.avatar) {
    res.status(404).send({ message: 'Запрос неверно сформирован' });
    return;
  }

  User.findByIdAndUpdate(_id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send(user))
    .catch((err) => res.status(400).send({ message: `Произошла ошибка ${err}` }));
};

module.exports.getUserAvatar = (req, res) => {
  const { _id } = req.user;

  if (req.body.name || req.body.link) {
    res.status(404).send({ message: 'Запрос неверно сформирован' });
    return;
  }

  User.findByIdAndUpdate(_id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send(user))
    .catch((err) => res.status(400).send({ message: `Произошла ошибка ${err}` }));
};

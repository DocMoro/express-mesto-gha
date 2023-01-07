const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({}).select(['-createdAt'])
    .then((card) => res.send(card))
    .catch((err) => res.status(400).send({ message: `Произошла ошибка ${err}` }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card.create({ name, link, owner: _id }).select(['-createdAt'])
    .then((card) => res.send(card))
    .catch((err) => res.status(400).send({ message: `Произошла ошибка ${err}` }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId).select(['-createdAt'])
    .then((card) => res.send(card))
    .catch((err) => res.status(400).send({ message: `Произошла ошибка ${err}` }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).select(['-createdAt'])
    .then((card) => res.send(card))
    .catch((err) => res.status(400).send({ message: `Произошла ошибка ${err}` }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).select(['-createdAt'])
    .then((card) => res.send(card))
    .catch((err) => res.status(400).send({ message: `Произошла ошибка ${err}` }));
};

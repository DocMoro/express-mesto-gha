const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({}).select(['-createdAt'])
    .then((card) => res.send(card))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card.create({ name, link, owner: _id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
        return;
      }

      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId).select(['-createdAt'])
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Удаляемая карточки не найдена' });
        return;
      }

      res.send(card);
    })
    .catch(() => res.status(400).send({ message: 'Произошла ошибка' }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).select(['-createdAt'])
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Удаляемая карточки не найдена' });
        return;
      }

      res.send(card);
    })
    .catch(() => res.status(400).send({ message: 'Произошла ошибка' }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).select(['-createdAt'])
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Удаляемая карточки не найдена' });
        return;
      }

      res.send(card);
    })
    .catch(() => res.status(400).send({ message: 'Произошла ошибка' }));
};

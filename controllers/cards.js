const Card = require('../models/card');

const ERR_404 = 'Ресурс по запрашиваемому _id не найден';
const ERR_400 = 'Переданы некорректные данные';

module.exports.getCards = (req, res) => {
  Card.find({}).select(['-createdAt'])
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card.create({ name, link, owner: _id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new Error_400(ERR_400));
      }

      next(err);
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId).select(['-createdAt'])
    .then((card) => {
      if (!card) {
        throw new Error_404(ERR_404);
      }

      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new Error_400(ERR_400));
      }

      next(err);
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).select(['-createdAt'])
    .then((card) => {
      if (!card) {
        throw new Error_404(ERR_404);
      }

      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new Error_400(ERR_400));
      }

      next(err);
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).select(['-createdAt'])
    .then((card) => {
      if (!card) {
        throw new Error_404(ERR_404);
      }

      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new Error_400(ERR_400));
      }

      next(err);
    });
};

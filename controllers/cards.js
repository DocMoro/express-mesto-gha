const Card = require('../models/card');

const Error404 = require('../errors/error-404');
const Error400 = require('../errors/error-400');
const Error403 = require('../errors/error-403');

const { ERR_404, ERR_400, ERR_403 } = require('../utils/constants');

module.exports.getCards = (req, res, next) => {
  Card.find({}).select(['-createdAt'])
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card.create({ name, link, owner: _id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new Error400(ERR_400));
      }

      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new Error404(ERR_404);
      }

      if (`${card.owner}` !== req.user._id) {
        throw new Error403(ERR_403);
      }

      return Card.findByIdAndRemove(req.params.cardId).select(['-createdAt']);
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new Error400(ERR_400));
      }

      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).select(['-createdAt'])
    .then((card) => {
      if (!card) {
        throw new Error404(ERR_404);
      }

      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new Error400(ERR_400));
      }

      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).select(['-createdAt'])
    .then((card) => {
      if (!card) {
        throw new Error404(ERR_404);
      }

      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new Error400(ERR_400));
      }

      return next(err);
    });
};

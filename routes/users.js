const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const url = /^https*:\/\/(www\.)*[\w-.~:\/?#[\]@!$&'()*\+,;=]{1,}$/;

const {
  getUserProfile,
  getUsers,
  getUserId,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/me', getUserProfile);

router.get('/', getUsers);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserId);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(url).required(),
  }),
}), updateUserAvatar);

module.exports = router;

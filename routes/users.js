const router = require('express').Router();
const {
  getUserProfile,
  getUsers,
  getUserId,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/me', getUserProfile);

router.get('/', getUsers);

router.get('/:userId', getUserId);

router.patch('/me', updateUser);

router.patch('/me/avatar', updateUserAvatar);

module.exports = router;

const mongoose = require('mongoose');

const { ERR_400, URL } = require('../utils/constants');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return URL.test(v);
      },
      message: ERR_400,
    },
  },
  owner: {
    type: mongoose.ObjectId,
    required: true,
  },
  likes: [{
    type: mongoose.ObjectId,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  versionKey: false,
});

module.exports = mongoose.model('card', cardSchema);

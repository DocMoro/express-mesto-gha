const express = require('express');
const mongoose = require('mongoose');
const bobeParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');

const { PORT = 3000 } = process.env;

const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const Error404 = require('./errors/error-404');

const ERR_500 = 'На сервере произошла ошибка';
const ERR_404 = 'Запрошен не существующий роут';

const app = express();
app.use(bobeParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.post('/signin', login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
  })
}), createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('/', (req, res, next) => {
  next(new Error404(ERR_404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? ERR_500
        : message,
    });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

const express = require('express');
const mongoose = require('mongoose');
const bobeParser = require('body-parser');

const { PORT = 3000 } = process.env;
const { login, createUser } = require('./controllers/users');

const ERR_404 = 'Запрошен не существующий роут';

const app = express();
app.use(bobeParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('/', (req, res) => {
  res.status(404).send({ message: ERR_404 });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

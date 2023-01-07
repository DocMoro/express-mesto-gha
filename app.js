const express = require('express');
const mongoose = require('mongoose');
const bobeParser = require('body-parser');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bobeParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '63b82f41a9462782b465d448',
  };

  next();
});

app.use('/users', require('./routes/users'));

app.use('/cards', require('./routes/cards'));

app.use('/', (req, res) => {
  res.status(404).send({ message: 'Некоректный путь запроса' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

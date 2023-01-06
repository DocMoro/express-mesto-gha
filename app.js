const express = require('express');
const mongoose = require('mongoose');
const bobeParser = require('body-parser');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bobeParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use('/users', require('./routes/users'));

app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133',
  };

  next();
});

app.use('/cards', require('./routes/cards'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

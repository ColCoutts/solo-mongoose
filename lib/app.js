const express = require('express');
const app = express();

app.use(express.json());
app.use('/tweets', require('../lib/routes/tweet.js'));

module.exports = app;
const express = require('express');
const app = express();

app.use(express.json());
app.use(require('../lib/middleware/timelogger'));
app.use('/users', require('../lib/routes/users.js'));
app.use('/tweets', require('../lib/routes/tweet.js'));

module.exports = app;

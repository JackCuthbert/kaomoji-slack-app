if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');

const app = express();
const routes = require('./config/routes');

// middleware
const bodyParser = require('body-parser');
const sessions = require('client-sessions');
const addRequestId = require('express-request-id');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessions({
  cookieName: 'kaomojiConnect',
  secret: process.env.KAOMOJI_SESSION_SECRET,
  cookie: {
    secureProxy: true,
  },
}));
app.use(addRequestId());

app.use(routes);

module.exports = app;

const express = require('express');
const bodyParser = require('body-parser');
const sessions = require('client-sessions');
const addRequestId = require('express-request-id');
const Database = require('./middleware/Database');

const app = express();

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// For processing slack requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Client connection pool
app.use(Database.pool());

// Unique ID for state param
app.use(sessions({
  cookieName: 'kaomojiConnect',
  secret: process.env.KAOMOJI_SESSION_SECRET,
  cookie: {
    secureProxy: true,
  },
}));
app.use(addRequestId());

// Controllers
const botController = require('./controllers/botController');
const authController = require('./controllers/authController');

// Slack Routes
app.post('/bot/command', botController.slashCommand);
app.post('/bot/button', botController.interactiveButton);
app.get('/connect', authController.callback);
app.get('/addtoslack', authController.redirect);

// TODO: View engine
// Add to slack button
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: './public' });
});

// Success page
app.get('/connected', (req, res) => {
  res.sendFile('connected.html', { root: './public' });
});

module.exports = app;

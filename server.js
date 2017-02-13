const express = require('express');
const bodyParser = require('body-parser');
const Database = require('./middleware/Database');

const app = express();

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// For processing slack requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(Database({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_POST,
}));

// Controllers
const botController = require('./controllers/botController');
const authController = require('./controllers/authController');

// Slack Routes
app.post('/app', botController.index);
app.get('/connect', authController.callback);
app.get('/addtoslack', (req, res) => {
  res.redirect('https://slack.com/oauth/authorize?scope=commands,bot,chat:write:bot&client_id=137226021060.138456996515');
});

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

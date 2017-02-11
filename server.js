const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// For processing slack requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Controllers
const botController = require('./controllers/bot');
const authController = require('./controllers/auth');

// Slack Routes
app.post('/app', botController.index);
app.get('/connect', authController.callback);

// TODO: View engine
// Add to slack button
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: './public' });
});

// Success page
app.get('/connected', (req, res) => {
  res.sendFile('connected.html', { root: './public' });
});

app.listen(port, () => {
  console.log(`Slack App running on ${port}`);
});

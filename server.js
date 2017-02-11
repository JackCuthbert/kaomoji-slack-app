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

// Server home page
app.use(express.static(`${__dirname}/public'`));

// Controllers
const botController = require('./controllers/bot');
const authController = require('./controllers/auth');

// Slack Routes
app.post('/app', botController.test);
app.get('/connect', authController.callback);

// Add to slack button
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: './public' });
});

app.listen(port, () => {
  console.log(`Slack Bot server running on ${port}`);
});

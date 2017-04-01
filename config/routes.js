const express = require('express');

const router = express.Router();

// Controllers
const bot = require('../api/bot');
const auth = require('../api/auth');

// TODO: View engine
// Add to slack button
router.get('/', (req, res) => {
  res.sendFile('index.html', { root: './public' });
});

// bot routes
router.post('/bot/command', bot.command);
router.post('/bot/button', bot.button);

// add kaomoji to slack
router.get('/addtoslack', auth.addtoslack);
router.get('/auth/callback', auth.callback);
router.get('/auth/connected', (req, res) => {
  res.sendFile('connected.html', { root: './public' });
});

module.exports = router;

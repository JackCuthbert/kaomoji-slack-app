const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
};


// Controllers
const botController = require('./controllers/bot');
const authController = require('./controllers/auth');


app.get('/', botController.index);
app.get('/auth', authController.index);
app.get('/auth/callback', authController.callback);

app.get('/auth/createTeam', authController.createTeam);

app.listen(port, () => {
  console.log(`Slack Bot server running on ${port}`);
});

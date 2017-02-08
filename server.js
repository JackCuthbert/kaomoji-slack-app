const express = require('express');
const app = express();

const port = process.env.PORT || 3000;


// Controllers
const botController = require('./controllers/bot');
const authController = require('./controllers/auth');


app.get('/', botController.index);
app.get('/auth', authController.index);
app.get('/auth/callback', authController.callback);

app.listen(port, () => {
  console.log(`Slack Bot server running on ${port}`);
});

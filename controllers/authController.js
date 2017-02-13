const axios = require('axios');
const querystring = require('querystring');

const Team = require('../services/Team');

exports.callback = (req, res) => {
  const { code } = req.query;

  axios.post('https://slack.com/api/oauth.access', querystring.stringify({
    client_id: process.env.SLACK_CLIENT_ID || '',
    client_secret: process.env.SLACK_CLIENT_SECRET || '',
    code: code || '',
  }))
  .then((response) => {
    const { ok, team_id, access_token, bot } = response.data;
    const { bot_access_token, bot_user_id } = bot;

    if (ok) {
      Team.create(req.dbClient, team_id, access_token, bot_user_id, bot_access_token)
        .then(() => {
          res.status(200);
          res.redirect('/connected');
        })
        .catch((err) => {
          console.error(err);
          res.send(err);
        });
    }
  })
  .catch((err) => {
    console.error(err);
    res.send('Team creation failed.');
  });
};

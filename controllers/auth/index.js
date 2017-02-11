const axios = require('axios');
const querystring = require('querystring');

const Team = require('../../models/Team');

exports.callback = (req, res) => {
  const { code } = req.query;

  axios.post('https://slack.com/api/oauth.access', querystring.stringify({
    client_id: process.env.SLACK_CLIENT_ID,
    client_secret: process.env.SLACK_CLIENT_SECRET,
    code,
  }))
  .then((response) => {
    const { ok, team_id, access_token } = response.data;
    console.log(response.data);

    if (ok) {
      Team.create(team_id, access_token)
        .then((msg) => {
          res.send(msg);
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

const axios = require('axios');
const querystring = require('querystring');
const crypto = require('crypto');

const { Team } = require('../config/models');

exports.callback = (req, res) => {
  const { code, state } = req.query;

  // Verify that the state matches the hash we sent
  if (state !== req.kaomojiConnect.state) {
    res.status(400);
    res.send('Invalid state');
  }

  // Terminate the session immediately
  req.kaomojiConnect.reset();

  axios.post('https://slack.com/api/oauth.access', querystring.stringify({
    client_id: process.env.SLACK_CLIENT_ID || '',
    client_secret: process.env.SLACK_CLIENT_SECRET || '',
    code: code || '',
  }))
  .then((response) => {
    const { ok, team_id, access_token } = response.data;

    if (ok) {
      // TODO: bookshelf/knex doesn't support upserts
      Team.where({ team_id })
        .fetchAll()
        .then((collection) => {
          if (collection.length === 1) {
            return collection.at(0).set({ access_token }).save();
          }

          return new Team({ team_id, access_token }).save();
        })
        .then(() => {
          res.redirect('/auth/connected');
        })
        .catch((err) => {
          res.status(500);
          res.send(err);
        });
    }
  })
  .catch((err) => {
    console.error(err);
    res.send('Team creation failed.');
  });
};

exports.addtoslack = (req, res) => {
  // Create a hash with the unique id and the state key to send to slack and
  // store in a session
  const hash = crypto.createHmac('sha256', process.env.KAOMOJI_STATE_KEY)
    .update(new Buffer(req.id, 'utf-8'))
    .digest('hex');

  const url = `https://slack.com/oauth/authorize?scope=commands,chat:write:bot&client_id=${process.env.SLACK_CLIENT_ID}&state=${hash}`;

  /* eslint no-param-reassign: 0 */
  req.kaomojiConnect.state = hash;

  res.redirect(url);
};

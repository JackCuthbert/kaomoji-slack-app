const Team = require('./Team');

const axios = require('axios');
const querystring = require('querystring');

exports.send = (res, data) => {
  Team.find(data.team_id)
    .then((team) => {
      return axios.post('https://slack.com/api/chat.postMessage', querystring.stringify({
        token: team.access_token,
        channel: data.channel_id,
        text: 'success',
        as_user: true,
      }));
    })
    .then((slackResponse) => {
      console.log(slackResponse.data);
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error(err);
      res.json({
        response_type: 'ephemeral',
        text: 'Something went wrong!',
      });
    });
};

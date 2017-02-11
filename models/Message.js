const axios = require('axios');
const querystring = require('querystring');

const Team = require('./Team');

// TODO: Replace with kaomoji resource
function buildString(text) {
  const kaomoji = '<kaomoji here>';
  const parts = text.split(' ');

  // If we only have one word, don't add on the user's text
  if (parts.length === 1) return kaomoji;
  return `${parts.splice(1, parts.length).join(' ')}  ${kaomoji}`;
}

// Send a message on behalf of the user that typed it
exports.send = (teamId, channelId, userId, text) => {
  return Team.find(teamId)
    .then((team) => {
      return axios.post('https://slack.com/api/chat.postMessage', querystring.stringify({
        token: team.access_token,
        channel: channelId,
        as_user: true,
        text: buildString(text),
      }));
    });
};

const axios = require('axios');
const querystring = require('querystring');

const Team = require('./Team');

// TODO: Replace with kaomoji resource
function buildString(text, userName) {
  const kaomoji = '<kaomoji here>';
  const parts = text.split(' ');
  const message = text
    .split(' ')
    .splice(1, parts.length)
    .join(' ');

  // If we only have one word, don't add on the user's text
  if (parts.length === 1) {
    return `>>> ${kaomoji}\n\n_— <@${userName}>_`;
  }

  return `>>> ${message}  ${kaomoji}\n\n_— <@${userName}>_`;
}

// Send a message on behalf of the user that typed it
exports.send = (teamId, channelId, userName, text, delayedUrl) => {
  return Team.find(teamId)
    .then((team) => {
      return axios.post('https://slack.com/api/chat.postMessage', querystring.stringify({
        token: team.bot_access_token,
        channel: channelId,
        as_user: true,
        text: buildString(text, userName),
      }))
      .then((res) => {
        if (!res.data.ok && res.data.error === 'not_in_channel') {
          return axios.post(delayedUrl, {
            token: team.access_token,
            response_type: 'ephemeral',
            text: 'Invite your Kaomoji bot to this channel! 「(°ヘ°)',
          });
        }

        return res;
      });
    });
};

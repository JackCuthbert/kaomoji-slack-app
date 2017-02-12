const axios = require('axios');
const querystring = require('querystring');
const kaomojiAsscLib = require('./Kaomoji');

const Team = require('./Team');

const resolveInput = function resolveInput(input, library) {
  if (typeof input !== 'string') return 'help';
  const resolvedKey = Object.keys(library).filter(key => library[key].indexOf(input.toLowerCase()) !== -1);

  if (resolvedKey.length > 0) {
    return resolvedKey[0];
  }

  return 'help';
};

// TODO: Replace with kaomoji resource
function buildString(text, userName, library) {
  const parts = text.split(' ');
  const kaomoji = resolveInput(parts[0], library);
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

// Construct and sent a kaomoji message
exports.send = (teamId, channelId, userName, text, delayedUrl) => (
  Team.find(teamId)
    .then(team => (
      // Send a message as the bot user
      axios.post('https://slack.com/api/chat.postMessage', querystring.stringify({
        token: team.bot_access_token,
        channel: channelId,
        as_user: true,
        text: buildString(text, userName, kaomojiAsscLib),
      }))
      .then((res) => {
        // If it failed, it's likely that the bot is not_in_channel. Send
        // prompt output fot that
        if (!res.data.ok && res.data.error === 'not_in_channel') {
          return axios.post(delayedUrl, {
            token: team.access_token,
            response_type: 'ephemeral',
            text: 'Invite your Kaomoji bot to this channel! 「(°ヘ°)',
          });
        }

        return res;
      })
    ))
);

exports.resolveInput = resolveInput;

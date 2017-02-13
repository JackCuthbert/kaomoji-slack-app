const axios = require('axios');
const querystring = require('querystring');

const Team = require('./Team');
const Kaomoji = require('./Kaomoji');

/*
 * Builds the string that will be sent by the slack bot.
 * NOTE: text will always be a string
 */
exports.buildString = (text, userName) => {
  const parts = text.split(' ');
  const keyword = Kaomoji.resolveInput(parts[0]);
  const kaomojiList = Kaomoji.getKaomojiList(keyword);

  // Return undefined if there's no list.
  if (!kaomojiList) return undefined;

  const kaomoji = Kaomoji.chooseEmoji(kaomojiList);
  const message = text
    .split(' ')
    .splice(1, parts.length)
    .join(' ');

  // If we only have one word, don't add on the user's text
  if (parts.length === 1) {
    return `>>> ${kaomoji}\n\n_— <@${userName}>_`;
  }

  return `>>> ${message}  ${kaomoji}\n\n_— <@${userName}>_`;
};

/* eslint arrow-body-style: 0*/
/*
 * Construct and sent a kaomoji message to the slack api
 */
exports.send = (client, teamId, channelId, userName, text, responseUrl) => {
  return Team.find(client, teamId)
    .then((team) => {
      const message = this.buildString(text, userName);

      // If message is undefined, we couldn't find a match
      // TODO: Using undefined to work this out probably isn't the best way to
      // do it. Fix later.
      if (!message) {
        return axios.post(responseUrl, {
          token: team.access_token,
          response_type: 'ephemeral',
          text: 'I don\'t know what that is! .·´¯`(>▂<)´¯`·.',
        });
      }

      // Send a message as the bot user
      return axios.post('https://slack.com/api/chat.postMessage', querystring.stringify({
        token: team.bot_access_token,
        channel: channelId,
        as_user: true,
        text: message,
      }))
      .then((res) => {
        // If it failed, it's likely that the bot is not_in_channel. Send
        // prompt output fot that
        if (!res.data.ok && res.data.error === 'not_in_channel') {
          return axios.post(responseUrl, {
            token: team.access_token,
            response_type: 'ephemeral',
            text: 'Invite your Kaomoji bot to this channel! 「(°ヘ°)',
          });
        }

        return res;
      })
      .catch((err) => {
        console.err(err);
      });
    });
};

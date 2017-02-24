const axios = require('axios');
const qs = require('qs');

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
    return `${kaomoji}\n\n_— <@${userName}>_`;
  }

  return `${message}  ${kaomoji}\n\n_— <@${userName}>_`;
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

      return axios.post('https://slack.com/api/chat.postMessage', qs.stringify({
        token: team.access_token,
        channel: channelId,
        as_user: false,
        text: message,
      }))
      .then((res) => {
        if (!res.data.ok) {
          console.error(res.data.error);
          return axios.post(responseUrl, {
            token: team.access_token,
            response_type: 'ephemeral',
            text: 'Uh oh! Something broke! 「(°ヘ°)',
          });
        }

        // Send a message as the bot user
        const attachments = [
          {
            title: 'Did I get that kaomoji correct?',
            color: '#ff80ab',
            attachment_type: 'default',
            // Bit of a hack, see botController.interactiveButton() for why I'm
            // doing this
            callback_id: `kaomoji_corrections/${res.data.message.ts}`,
            actions: [
              {
                name: 'yes',
                type: 'button',
                text: 'Yep',
                style: 'primary',
                value: 'correct',
              },
              {
                name: 'no',
                type: 'button',
                text: 'Nope',
                style: 'danger',
                value: 'incorrect',
              },
            ],
          },
        ];

        console.log('Sending confirm', res.data);

        // Return some buttons to help us understand if the kaomoji wasn't
        // quite right
        return axios.post(responseUrl, {
          token: team.access_token,
          response_type: 'ephemeral',
          attachments,
        })
        .catch((err) => {
          console.error(err);
        });
      })
      .catch((err) => {
        console.err(err);
      });
    });
};

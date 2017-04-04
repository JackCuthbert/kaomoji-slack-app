const axios = require('axios');
const qs = require('qs');

const staticMessages = require('./lib/staticMessages');
const renderAttachments = require('./lib/renderAttachments');
const { Team, Stat } = require('../config/models');
const Kaomoji = require('./Kaomoji');

/*
 * construct and sent a kaomoji message to the slack api
 */
exports.send = (team, channel, username, text, url) => {
  const renderedMessage = Kaomoji.buildMessage(text);
  let accessToken;

  Team.where({ team_id: team })
    .fetch()
    .then((model) => {
      accessToken = model.attributes.access_token;

      // If message is undefined, we couldn't find a match
      // TODO: Using undefined to work this out probably isn't the best way to
      // do it. Fix later.
      if (!renderedMessage) {
        return axios
          .post(url, {
            token: accessToken,
            response_type: 'ephemeral',
            text: `I don't know what that is! ${Kaomoji.renderEmoji('crying')}`,
          });
      }

      return axios
        .post('https://slack.com/api/chat.postMessage', qs.stringify({
          token: accessToken,
          channel,
          as_user: false,
          attachments: JSON.stringify([
            {
              color: '#ffa0c0',
              text: renderedMessage,
              footer: `Posted using /kaomoji by @${username}`,
            },
          ]),
        }));
    })
    .then((res) => {
      if (res.data !== 'ok' && !res.data.ok) {
        const { error, ts } = res.data;
        console.log({ error, text, username, channel, team });
        return axios
          .post(url, {
            token: accessToken,
            response_type: 'ephemeral',
            text: 'Uh oh! Something broke! 「(°ヘ°)',
            attachments: staticMessages.serverErrorAttachments(text, error, username, channel, team, ts),
          });
      }

      if (!renderedMessage) return res;

      return axios
        .post(url, {
          token: accessToken,
          response_type: 'ephemeral',
          attachments: renderAttachments(renderedMessage, text, res.data.ts, channel),
        })
        .then(() => {
          // Count a successful serve
          Stat
            .where({ id: 1 })
            .fetch()
            .then((model) => {
              model.set({ served: Number(model.attributes.served) + 1 }).save();
            });

          return res;
        });
    });
};

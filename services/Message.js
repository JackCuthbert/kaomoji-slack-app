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
  let accessToken;
  let message;

  Team
    .where({ team_id: team })
    .fetch()

    // step 1: find access token for team
    .then((model) => {
      accessToken = model.attributes.access_token;
    })

    // step 2: attempt to build the message
    .then(Kaomoji.buildMessage(text))

    // step 3: attempt to send the message
    .then((builtMessage) => {
      message = builtMessage;

      // If the message is undefined, this means we failed to match a kaomoji
      if (!message) {
        return Kaomoji.renderEmoji('crying')
          .then(crying => (
            axios.post(url, {
              token: accessToken,
              response_type: 'ephemeral',
              text: `I don't know what that is! ${crying}`,
            })
        ));
      }

      // Otherwise, send the nice message!
      return axios.post('https://slack.com/api/chat.postMessage', qs.stringify({
        token: accessToken,
        channel,
        attachments: JSON.stringify([
          {
            color: '#ffa0c0',
            text: message,
            footer: `Posted using /kaomoji by @${username}`,
          },
        ]),
      }));
    })

    // step 4: handle any slack errors
    .then((res) => {
      // If the message failed to send, send some useful information to console and slack
      if (res.data !== 'ok' && !res.data.ok) {
        const { error, ts } = res.data;
        console.log({ error, text, username, channel, team });
        return axios.post(url, {
          token: accessToken,
          response_type: 'ephemeral',
          text: 'Uh oh! Something broke! 「(°ヘ°)',
          attachments: staticMessages.serverErrorAttachments(text, error, username, channel, team, ts),
        });
      }

      // If no message was built and we didn't hit any slack errors, pass through the previus response
      if (!message) return res;

      // Otherwise, we should render some nice feedback buttons
      return axios.post(url, {
        token: accessToken,
        response_type: 'ephemeral',
        attachments: renderAttachments(message, text, res.data.ts, channel),
      });
    })

    // step 5: count the message as a successful stat
    .then((res) => {
      if (message) {
        Stat.where({ id: 1 }).fetch()
          .then((model) => {
            model.set({ served: Number(model.attributes.served) + 1 }).save();
          });
      }

      return res;
    });
};

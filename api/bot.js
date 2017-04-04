const Message = require('../services/Message');
const Kaomoji = require('../services/Kaomoji');

const axios = require('axios');
const qs = require('qs');
const { Team } = require('../config/models');
const staticMessages = require('../services/lib/staticMessages');

exports.command = (req, res) => {
  if (req.body.token !== process.env.SLACK_VERIFICATION_TOKEN) {
    res.send('Please add the Kaomoji App to your team');
    return;
  }

  const { team_id, channel_id, user_name, text, response_url } = req.body;

  if (text === '') {
    res.send(staticMessages.blank());
  } else if (text === 'help') {
    axios.get('https://api.github.com/repos/JackCuthbert/kaomoji-bot/commits')
      .then((response) => {
        const { data } = response;
        const sha = data[0].sha.substring(0, 6);
        const message = data[0].commit.message;

        res.send(staticMessages.help(sha, message));
      });
  } else {
    // Send the message!
    res.send(staticMessages.searching());
    Message.send(team_id, channel_id, user_name, text, response_url);
  }
};

exports.button = (req, res) => {
  // For some reason we need to parse JSON here because slack
  // doesn't do it for us
  // https://api.slack.com/docs/message-buttons
  const payload = JSON.parse(req.body.payload);

  if (payload.token !== process.env.SLACK_VERIFICATION_TOKEN) {
    res.send('Please add the Kaomoji App to your team');
    return;
  }

  const { callback_id, actions, team, user } = payload;

  if (actions[0].name !== 'correct' && actions[0].name !== 'nsfw') {
    const happyKaomoji = Kaomoji.renderEmoji('excited');
    const feedbackMessage = `Thanks, ${user.name}! I'll try and get it right next time ${happyKaomoji}`;
    res.send({ response_type: 'ephemeral', text: feedbackMessage });
  } else if (actions[0].name === 'nsfw') {
    // If the message is nsfw, delete it!
    const messageInfo = actions[0].value.split(':');

    Team.where({ team_id: team.id })
      .fetch()
      .then(model => (
        axios
          .post('https://slack.com/api/chat.delete', qs.stringify({
            token: model.attributes.access_token,
            ts: messageInfo[0],
            channel: messageInfo[1],
          }))
          .then(() => {
            res.send({
              response_type: 'ephemeral',
              text: `Thanks, ${user.name}! I'll mark this as inappropriate. ${Kaomoji.renderEmoji('salute')}`,
            });
          })
          .catch((err) => {
            console.log(err);
          })
      ));
  } else {
    res.send({ response_type: 'ephemeral', text: `Thanks, ${user.name}!` });
  }

  if (actions[0].name !== 'correct') {
    console.log('Kaomoji feedback:');
    console.log({
      feedbackType: actions[0].name,
      // Decode the base64 encoded string from the callback ID as JSON
      originalText: JSON.parse(Buffer.from(callback_id, 'base64').toString('utf8')),
      team,
    });
  }
};

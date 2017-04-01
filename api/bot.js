const Message = require('../services/Message');
const Kaomoji = require('../services/Kaomoji');

const axios = require('axios');
const qs = require('qs');
const { Team } = require('../config/models');

exports.command = (req, res) => {
  if (req.body.token !== process.env.SLACK_VERIFICATION_TOKEN) {
    res.send('Please add the Kaomoji App to your team');
    return;
  }

  const { team_id, channel_id, user_name, text, response_url } = req.body;

  // Return some buttons to help us understand if the kaomoji wasn't
  // quite right
  res.send({
    response_type: 'ephemeral',
    text: 'Searching...',
  });

  // Send the message!
  Message.send(team_id, channel_id, user_name, text, response_url);
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
          .catch((err) => {
            console.log(err);
          })
      ));
  } else {
    res.send({ response_type: 'ephemeral', text: `Thanks, ${user.name}!` });
  }

  console.log('Kaomoji feedback:');
  console.log({
    feedbackType: actions[0].name,
    // Decode the base64 encoded string from the callback ID as JSON
    originalText: JSON.parse(Buffer.from(callback_id, 'base64').toString('utf8')),
    team,
  });
};

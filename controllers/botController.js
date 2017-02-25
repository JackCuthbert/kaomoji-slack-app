const Message = require('../services/Message');
const Kaomoji = require('../services/Kaomoji');

exports.slashCommand = (req, res) => {
  if (req.body.token !== process.env.SLACK_VERIFICATION_TOKEN) {
    res.send('Please add the Kaomoji App to your team');
    return;
  }

  const { team_id, channel_id, user_name, text, response_url } = req.body;

  // Send an immediate response so that it doesn't timeout
  // TODO: Can we update this after a successful message is sent?
  if (process.env.NODE_ENV !== 'production') {
    res.send({
      response_type: 'ephemeral',
      text: 'Searching...',
    });
  } else {
    res.sendStatus(200);
  }

  // Send the message!
  Message.send(req.dbClient, team_id, channel_id, user_name, text, response_url)
    .catch((err) => {
      console.error(err);
      res.json({
        response_type: 'ephemeral',
        text: 'Something went wrong! o(╥﹏╥)o',
      });
    });
};

exports.interactiveButton = (req, res) => {
  // For some reason we need to parse JSON here because slack
  // doesn't do it for us
  // https://api.slack.com/docs/message-buttons
  const payload = JSON.parse(req.body.payload);

  if (payload.token !== process.env.SLACK_VERIFICATION_TOKEN) {
    res.send('Please add the Kaomoji App to your team');
    return;
  }

  const { callback_id, actions, team, user } = payload;

  if (actions[0].value !== 'correct') {
    console.log('Kaomoji feedback:', {
      feedbackType: actions[0].value,
      // Decode the base64 encoded string from the callback ID as JSON
      originalText: JSON.parse(Buffer.from(callback_id, 'base64').toString('utf8')),
      team,
      user,
    });

    const happyKaomoji = Kaomoji.renderEmoji('excited');
    const feedbackMessage = `Thanks, ${user.name}! I'll try and get it right next time ${happyKaomoji}`;

    res.send({
      response_type: 'ephemeral',
      text: feedbackMessage,
    });
  } else {
    res.send({
      response_type: 'ephemeral',
      text: `Thanks, ${user.name}!`,
    });
  }
};

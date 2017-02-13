const Message = require('../services/Message');

exports.index = (req, res) => {
  if (req.body.token !== process.env.SLACK_VERIFICATION_TOKEN) {
    res.send('Please add the Kaomoji App to your team');
    return;
  }

  const { team_id, channel_id, user_name, text, response_url } = req.body;

  // Send an immediate response so that it doesn't timeout
  // TODO: Can we update this after a successful message is sent?
  res.send({
    response_type: 'ephemeral',
    text: 'Searching...',
  });

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

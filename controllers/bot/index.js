const { getHelpList } = require('./utils/kaomoji');
const handleCommand = require('./utils/handleCommand');

const Message = require('../../models/Message');

exports.index = (req, res) => {
  const { text } = req.query;

  // Route commands to appropriate functions
  switch (text) {
    case 'help':
      res.json({ type: 'ephemeral', text: getHelpList() });
      break;
    default: {
      handleCommand(text, res);
    }
  }
};

exports.test = (req, res) => {
  console.log(req.body);

  if (req.body.token !== process.env.SLACK_VERIFICATION_TOKEN) {
    res.send('Please add the Kaomoji App to your team');
    return;
  }

  Message.send(res, req.body);
};

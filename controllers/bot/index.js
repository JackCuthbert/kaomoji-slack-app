const { getHelpList } = require('./utils/kaomoji');
const handleCommand = require('./utils/handleCommand');

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

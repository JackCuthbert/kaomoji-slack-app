const fs = require('fs');
const jsonfile = require('jsonfile');
const { chooseEmoji, getHelpList, getErrorText } = require('./kaomoji');

const path = './kaomoji';

function buildResponse(commandParts, obj) {
  // If we only have one word, don't add on the user's text
  if (commandParts.length === 1) return chooseEmoji(obj);
  return `${commandParts.splice(1, commandParts.length).join(' ')}  ${chooseEmoji(obj)}`;
}

module.exports = (text, res) => {
  const commandParts = text.split(' ');
  const fileName = `${path}/${commandParts[0]}.json`;

  fs.exists(fileName, (exists) => {
    if (!exists) {
      jsonfile.readFile(`${path}/sad.json`, (err, obj) => {
        // If the file can't be read, return a generic error to the user and
        // log it somewhere
        if (err) {
          console.error(err);
          res.json({ response_type: 'ephemeral', text: getErrorText() });
        } else {
          // If the file doesn't exist and reading didn't throw an error, send
          // the user a cute response and some help text
          res.json({
            response_type: 'ephemeral',
            text: `I don't know what that is! ${chooseEmoji(obj)}`,
            attachments: [{ text: getHelpList() }],
          });
        }
      });
    } else {
      jsonfile.readFile(fileName, (err, obj) => {
        // If the file can't be read, return a generic error to the user and
        // log it somewhere
        if (err) {
          console.error(err);
          res.json({ response_type: 'ephemeral', text: getErrorText() });
        } else {
          // We've found an emoji here, send it in the channel and choose a
          // random one
          res.json({
            response_type: 'in_channel',
            text: buildResponse(commandParts, obj),
          });
        }
      });
    }
  });
};

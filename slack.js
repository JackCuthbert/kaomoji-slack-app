const express = require('express');
const app = express();

const fs = require('fs');

// Emoji lib
const jsonfile = require('jsonfile');
const chooseEmoji = require('./utils/chooseEmoji');

const port = process.env.PORT || 3000;

function getHelpList() {
  const feelings = [];
  const files = fs.readdirSync('./kaomoji');

  // Push on each file and remove the file extension
  files.forEach((file) => {
    feelings.push(file.slice(0, -'.json'.length));
  });

  return `Available kaomoji: ${feelings.join(', ')}`;
}

function getErrorText() {
  return 'Opps I broke (｡•́︿•̀｡)\nI\'m working on a fix for that now!';
}

app.get('/', (req, res) => {
  const { text } = req.query;

  switch (text) {
    case 'help':
      res.json({
        type: 'ephemeral',
        text: getHelpList(),
      });
      break;
    case 'about':
      res.send('something');
      break;
    default: {
      const fileName = `./kaomoji/${text}.json`;
      fs.exists(fileName, (exists) => {
        if (!exists) {
          jsonfile.readFile('./kaomoji/sad.json', (err, obj) => {
            if (err) {
              console.error(err);
              res.json({
                response_type: 'ephemeral',
                text: getErrorText(),
              });
            } else {
              res.json({
                response_type: 'ephemeral',
                text: `I don't know what that is! ${chooseEmoji(obj)}`,
                attachments: [
                  { text: getHelpList() },
                ],
              });
            }
          });
        } else {
          jsonfile.readFile(fileName, (err, obj) => {
            if (err) {
              console.error(err);
              res.json({
                response_type: 'ephemeral',
                text: getErrorText(),
              });
            } else {
              res.json({
                response_type: 'in_channel',
                text: chooseEmoji(obj),
              });
            }
          });
        }
      });
    }
  }
});

app.listen(port, () => {
  console.log(`Slack Bot server running on ${port}`);
});

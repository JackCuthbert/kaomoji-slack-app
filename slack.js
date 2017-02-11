const express = require('express');
const app = express();

const fs = require('fs');

// Emoji lib
const jsonfile = require('jsonfile');
const chooseEmoji = require('./utils/chooseEmoji');
const keywordLib = require('./utils/keywordLib');

const port = process.env.PORT || 3000;

function resolveInput(input, library) {
  const resolvedKey = Object.keys(library).filter(key => library[key].indexOf(input) !== -1);

  if (resolvedKey.length > 0) {
    // Temporarily returning first
    // There could be multiple response keys though because
    // of crossover of terms associated with multiple keys
    return resolvedKey[0];
  }

  return 'help';
}

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
  const text = resolveInput(req.query.text, keywordLib);

  switch (text) {
    case 'help':
      res.json({
        type: 'ephemeral',
        text: getHelpList(),
      });
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

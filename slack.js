const express = require('express');
const app = express();

const fs = require('fs');

// Emoji lib
const jsonfile = require('jsonfile');
const chooseEmoji = require('./utils/chooseEmoji');

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  const { text } = req.query;

  if (text === 'help') {
    const feelings = [];
    fs.readdir('./kaomoji', (err, files) => {
      files.forEach((file) => {
        feelings.push(file.slice(0, -5));
      });

      res.send(`Available feelings: ${feelings.join(', ')}`);
    });
  } else {
    const fileName = `./kaomoji/${text}.json`;

    fs.exists(fileName, (exists) => {
      if (!exists) {
        jsonfile.readFile('./kaomoji/sad.json', (err, obj) => {
          res.send(`I don't know what that is! ${chooseEmoji(obj)}`);
        });
      } else {
        jsonfile.readFile(fileName, (err, obj) => {
          if (err) console.error(err);
          res.json({
            response_type: 'in_channel',
            text: chooseEmoji(obj),
          });
        });
      }
    });
  }
});

app.listen(port, () => {
  console.log(`Slack Bot server running on ${port}`);
});

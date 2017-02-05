const express = require('express');
const app = express();
const fs = require('fs');

// Emoji lib
const jsonfile = require('jsonfile');
const chooseEmoji = require('./utils/chooseEmoji');

const port = process.env.PORT || 3000;

app.get('/api/:category', (req, res) => {
  const { category } = req.params;
  const fileName = `./kaomoji/${category}.json`;

  fs.exists(fileName, (exists) => {
    if (!exists) {
      jsonfile.readFile('./kaomoji/sad.json', (err, obj) => {
        res.status(404);
        res.send(`I don't know what that is! ${chooseEmoji(obj)}`);
      });
    } else {
      jsonfile.readFile(fileName, (err, obj) => {
        if (err) console.error(err);
        res.status(200);
        res.send(chooseEmoji(obj));
      });
    }
  });
});

app.listen(port, () => {
  console.log(`API server running on ${port}`);
});

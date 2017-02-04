const express = require('express');
const app = express();

const fs = require('fs');

// Emoji lib
const jsonfile = require('jsonfile');
const chooseEmoji = require('./utils/chooseEmoji');

app.get('/api/:category', (req, res) => {
  const fileName = `./kaomoji/${req.params.category}.json`;

  fs.exists(fileName, (exists) => {
    if (!exists) {
      res.status(404);
      res.send(`Uh oh, we don't have that category! (▰︶︹︺▰)`);
    } else {
      jsonfile.readFile(fileName, (err, obj) => {
        if (err) console.error(err);
        res.status(200);
        res.send(chooseEmoji(obj));
      });
    }
  });

});

app.listen(process.env.PORT || 3000);

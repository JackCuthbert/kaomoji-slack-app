const fs = require('fs');

exports.getErrorText = function getErrorText() {
  return 'Opps I broke (｡•́︿•̀｡)\nI\'m working on a fix for that now!';
};

exports.getHelpList = function getHelpList() {
  const available = [];
  const files = fs.readdirSync('./kaomoji');

  // Push on each file and remove the file extension
  files.forEach((file) => {
    available.push(file.slice(0, -'.json'.length));
  });

  return available.join(', ');
};

exports.chooseEmoji = function chooseEmoji(data) {
  return data.emoji[Math.floor(Math.random() * data.emoji.length)];
};

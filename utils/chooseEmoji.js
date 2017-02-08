module.exports = function chooseEmoji(obj) {
  return obj.emoji[Math.floor(Math.random() * obj.emoji.length)];
};

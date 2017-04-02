const fs = require('fs');
const Fuse = require('fuse.js');
const index = require('./lib/kaomojiIndex');

const options = {
  id: 'fileName',
  include: ['score'],
  shouldSort: true,
  tokenize: true,
  threshold: 0.3,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 2,
  keys: [
    {
      name: 'fileName',
      weight: 0.4,
    },
    {
      name: 'synonyms',
      weight: 0.6,
    },
  ],
};
const fuse = new Fuse(index, options); // "list" is the item array

/*
 * Use the associations list object to resolve the keyword to a specific kaomoji
 * file.
 * returns:
 *   [{
 *     item: 'file-name',
 *     score: 0.1
 *   }]
 */
exports.resolveInput = input => fuse.search(input);

/*
 * Get the object in a kaomoji file.
 */
exports.getKaomojiList = (keyword) => {
  const path = './kaomoji';
  const files = fs.readdirSync(path);
  const kaomojiFile = files.find(file => file.includes(`${keyword}.json`));

  // Return the json object if the file is found, otherwise we still want to
  // return the result of .find()
  return kaomojiFile ? JSON.parse(fs.readFileSync(`${path}/${kaomojiFile}`)) : kaomojiFile;
};

/*
 * Randomly choose an emoji from a supplied kaomoji file object.
 */
exports.chooseEmoji = data => data.emoji[Math.floor(Math.random() * data.emoji.length)];

/*
 * Get a kaomoji from a keyword
 */
exports.renderEmoji = (keyword) => {
  const searchResults = this.resolveInput(keyword);
  const list = this.getKaomojiList(searchResults[0].item);

  return this.chooseEmoji(list);
};

/*
 * Builds the string that will be sent by the slack app.
 * NOTE: text will always be a string
 */
exports.buildMessage = (text) => {
  const parts = text.split(' ');
  const searchResults = this.resolveInput(text);

  if (searchResults.length === 0) return undefined;

  const kaomojiList = this.getKaomojiList(searchResults[0].item);
  const kaomoji = this.chooseEmoji(kaomojiList);

  // If we only have one word, don't add on the user's text
  if (parts.length === 1) return kaomoji;
  return `${text}  ${kaomoji}`;
};

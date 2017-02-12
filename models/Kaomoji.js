const fs = require('fs');

/*
 * Use the associations list object to resolve the keyword to a specific kaomoji
 * file.
 */
exports.resolveInput = (input) => {
  const resolvedKey = Object.keys(this.associationList)
    .filter(key => this.associationList[key].includes(input.toLowerCase()));

  if (resolvedKey.length > 0) {
    return resolvedKey[0];
  }

  return 'help';
};

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

/* eslint quote-props: 0 */
/*
 * Master list of kaomoji associations
 * TODO: Can we deal with this another way?
 */
exports.associationList = {
  'happy': ['happy', 'glad', 'positive', 'yay'],
  'sad': ['sad', 'unhappy', 'depressed', 'cry', 'crying', 'depressed'],
  'angry': ['angry'],
  'cloud': ['cloud'],
  'dog': ['dog'],
  'food-drink': ['food-drink'],
  'hugging': ['hugging'],
  'magic': ['magic'],
  'objects': ['objects'],
  'rom': ['rom'],
  'shy': ['shy'],
  'table-flipping': ['table-flipping'],
  'worried': ['worried'],
  'apologizing': ['apologizing'],
  'confused': ['confused'],
  'evil': ['evil'],
  'friend': ['friend'],
  'hungry': ['hungry'],
  'meh': ['meh'],
  'other-action': ['other-action'],
  'running': ['running'],
  'sleeping': ['sleeping'],
  'thinking': ['thinking'],
  'writing': ['writing'],
  'bear': ['bear'],
  'crazy': ['crazy'],
  'excited': ['excited'],
  'giving-up': ['giving-up'],
  'hurt-or-sick': ['hurt-or-sick'],
  'monkey': ['monkey'],
  'other-animal': ['other-animal'],
  'smug': ['smug'],
  'triumph-success': ['triumph-success'],
  'wtf': ['wtf'],
  'bird': ['bird'],
  'crying': ['crying'],
  'fighting-weapons-violent': ['fighting-weapons-violent'],
  'kissing': ['kissing'],
  'music': ['music'],
  'other': ['other'],
  'saluting': ['saluting'],
  'sports-related': ['sports-related'],
  'waving': ['waving'],
  'cat': ['cat'],
  'dancing': ['dancing'],
  'fish': ['fish'],
  'hiding': ['hiding'],
  'laughing': ['laughing'],
  'mustache': ['mustache'],
  'pig': ['pig'],
  'scared': ['scared'],
  'sunglasses': ['sunglasses'],
  'winking': ['winking'],
  'character-meme': ['character-meme'],
  'dead': ['dead'],
  'flexing': ['flexing'],
  'holiday': ['holiday'],
  'love': ['love'],
  'nose-bleed': ['nose-bleed'],
  'rabbit': ['rabbit'],
  'sheep': ['sheep'],
  'surprised': ['surprised'],
  'words': ['words'],
};

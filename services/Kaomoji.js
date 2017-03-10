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

/*
 * Get a kaomoji from a keyword
 */
exports.renderEmoji = (keyword) => {
  const file = this.resolveInput(keyword);
  const list = this.getKaomojiList(file);

  return this.chooseEmoji(list);
};

/* eslint quote-props: 0 */
/*
 * Master list of kaomoji associations
 * TODO: Can we deal with this another way?
 */
exports.associationList = {
  'happy': ['happy', 'glad', 'positive', 'yay', 'wee', 'wew'],
  'sad': ['sad', 'unhappy', 'depressed', 'cry', 'crying', 'depressed', 'oh'],
  'angry': ['angry', 'annoyed', 'bitter', 'enraged', 'exasperated', 'furious', 'heated', 'impassioned', 'indignant', 'irate', 'irritable', 'irritated', 'offended', 'outraged', 'resentful', 'sullen', 'uptight'],
  'cloud': ['cloud', 'darkness', 'fog', 'gloom', 'mist', 'puff', 'smog', 'smoke', 'steam', 'vapor', 'veil'],
  'dog': ['dog', 'pup', 'puppy', 'bitch', 'cur', 'doggy', 'hound', 'mongrel', 'mutt', 'pooch', 'stray', 'fido'],
  'food-drink': ['food-drink', 'cooking', 'cook', 'cuisine', 'drink', 'feed', 'food', 'foodstuff', 'meal', 'meat', 'snack', 'chow', 'diet', 'eats', 'fodder', 'grub', 'tucker'],
  'hugging': ['hugging', 'hug', 'affection', 'caress', 'hold'],
  'magic': ['magic', 'illusion', 'alchemy', 'astrology', 'wizardry', 'incantation', 'conjure', 'devilry', 'voodoo', 'witchcraft'],
  'objects': ['objects', 'object', 'item', 'gizmo', 'gadget', 'thingamajig'],
  'rom': ['rom'],
  'shy': ['shy', 'afraid', 'apprehensive', 'bashful', 'cautious', 'circumspect', 'coy', 'demure', 'fearful', 'hesitant', 'humble', 'modest', 'nervous', 'reluctant', 'sheepish', 'timid', 'wary', 'skittish'],
  'table-flipping': ['table-flipping', 'table-flip', 'table', 'flip', 'riot'],
  'worried': ['worried', 'bothered', 'concerned', 'distracted', 'distressed', 'disturbed', 'frightened', 'perturbed', 'tense', 'tormented', 'upset'],
  'apologizing': ['apologizing', 'apologize', 'apologise', 'atone', 'confess', 'withdraw'],
  'confused': ['confused', 'baffled', 'befuddled', 'bewildered', 'dazed', 'disorganized', 'disorganised'],
  'evil': ['evil', 'bad', 'corrupt', 'destructive', 'hateful', 'heinous', 'hideous', 'malevolent', 'malicious', 'nefarious', 'unpleasant', 'vile', 'vicious', 'wicked'],
  'friend': ['friend', 'buddy', 'ally', 'associate', 'classmate', 'colleague', 'companion', 'chum', 'mate', 'pal'],
  'hungry': ['hungry', 'starving', 'ravenous', 'hunger', 'yum'],
  'meh': ['meh', 'whatever', 'eh', 'bleh'],
  'other-action': ['other-action', 'actions', 'action'],
  'running': ['running', 'run', 'sprint', 'race', 'rush', 'jog', 'gallop'],
  'sleeping': ['sleeping', 'sleep', 'snooze', 'slumber', 'dream', 'hibernation', 'coma', 'nap', 'catnap', 'doze', 'bedtime', 'bed'],
  'thinking': ['thinking', 'think', 'ponder', 'pondering', 'deliberate', 'deliberating', 'meditate'],
  'writing': ['writing', 'write', 'compose', 'draft', 'note', 'record', 'letter', 'scrawl', 'inscribe'],
  'bear': ['bear'],
  'crazy': ['crazy', 'insane', 'kooky', 'mad', 'nuts', 'nutty', 'wacky', 'lunatic', 'cuckoo', 'berserk'],
  'excited': ['excited', 'agitated', 'eager', 'enthusiastic', 'thrilled'],
  'giving-up': ['giving-up', 'giveup'],
  'hurt-or-sick': ['hurt-or-sick', 'hurt', 'sick', 'ill', 'ouch', 'ow'],
  'monkey': ['monkey'],
  'other-animal': ['other-animal', 'animal'],
  'smug': ['smug', 'complacent', 'egotistical', 'pompous', 'superior', 'huehuehue'],
  'triumph-success': ['triumph-success'],
  'wtf': ['wtf'],
  'bird': ['bird', 'avian', 'duck', 'chick', 'chicken', 'hawk', 'crow', 'eagle', 'pidgeon'],
  'crying': ['crying', 'cry', 'sob', 'howl', 'bawl', 'tears'],
  'fighting-weapons-violent': ['fighting-weapons-violent', 'weapons', 'sword', 'fight', 'battle'],
  'kissing': ['kissing', 'kiss', 'smooch', 'peck'],
  'music': ['music', 'tunes', 'toons', 'rock', 'dance'],
  'other': ['other'],
  'saluting': ['saluting', 'salute'],
  'sports-related': ['sports-related', 'sports', 'sport', 'sportsball'],
  'waving': ['waving', 'wave', 'hi', 'bye', 'bai', 'hello', 'hey', 'welcome', 'ciao'],
  'cat': ['cat', 'feline', 'pussy', 'kitty', 'kitten', 'demon'],
  'dancing': ['dancing', 'dance', 'disco', 'samba', 'tango', 'waltz', 'jig', 'twist', 'rhumba', 'jitter'],
  'fish': ['fish', 'fishing', 'angle', 'bait'],
  'hiding': ['hiding', 'hide', 'shelter', 'protect', 'shield'],
  'laughing': ['laughing', 'laugh', 'chuckle', 'giggle', 'grin', 'lol', 'rofl', 'roflmao', 'heh', 'ha'],
  'mustache': ['mustache', 'beard', 'goatee', 'sideburns', 'stubble', 'bristles'],
  'pig': ['pig', 'pork', 'oink', 'cop', 'cops', 'police', 'policeman'],
  'scared': ['scared', 'terrified', 'anxious', 'panicked', 'petrified'],
  'sunglasses': ['sunglasses', 'sunnies', 'sun', 'glasses', 'spectacles'],
  'winking': ['winking', 'wink', 'twinkle', 'gleam', 'glimmer'],
  'character-meme': ['character-meme', 'meme'],
  'dead': ['dead', 'death', 'deceased', 'lifeless', 'buried', 'late', 'departed', 'stiff'],
  'flexing': ['flexing', 'flex', 'muscles', 'strong', 'gym', 'lift', 'lifting'],
  'holiday': ['holiday', 'vacation', 'relax', 'relaxing'],
  'love': ['love', 'devotion', 'fondness', 'stricken', 'lust', 'passion', 'tender', 'tenderness', 'yearning'],
  'nose-bleed': ['nose-bleed', 'nose', 'bleed', 'nosebleed'],
  'rabbit': ['rabbit', 'hare', 'bunny', 'bunnies', 'rodent', 'bugs'],
  'sheep': ['sheep', 'ewe', 'lamb'],
  'surprised': ['surprised', 'surprise', 'amazement', 'astonished', 'awe', 'miracle', 'revelation', 'wonder', 'shock'],
  'words': ['words', 'word', 'letter', 'letters', 'language'],
};

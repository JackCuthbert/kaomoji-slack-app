const expect = require('chai').expect;
const Message = require('../../models/Message');
const kaomojiAsscLib = require('../../models/Kaomoji');
// const fauxAsscLib = {
//   happy: ['happy', 'glad', 'positive', 'yay'],
//   sad: ['sad', 'unhappy', 'depressed', 'cry', 'crying', 'depressed'],
// };
const fauxKaomoji = {
  emoji: ['( ͡° ͜ʖ ͡°)', '∠( ᐛ 」∠)＿', '(ﾟ⊿ﾟ)', 'ᕕ( ᐛ )ᕗ', '_へ__(‾◡◝ )>'],
};

describe('Message', () => {
  it('returns the correct kaomoji file', () => {
    expect(Message.getKaomojiList('happy').title).to.equal('happy');
  });

  it('returns a kaomoji from array of kaomoji', () => {
    const kaomoji = Message.chooseEmoji(fauxKaomoji);
    expect(fauxKaomoji.emoji.indexOf(kaomoji)).to.not.equal(-1);
  });
});

describe('resolveInput', () => {
  it('returns "happy" when associated text passed in', () => {
    expect(Message.resolveInput('glad', kaomojiAsscLib)).to.equal('happy');
  });

  it('doesn\'t care about capitalization', () => {
    expect(Message.resolveInput('Glad', kaomojiAsscLib)).to.equal('happy');
    expect(Message.resolveInput('UNHAPPY', kaomojiAsscLib)).to.equal('sad');
  });

  it('returns "help" when no associated text is found', () => {
    expect(Message.resolveInput('blerg', kaomojiAsscLib)).to.equal('help');
  });
});

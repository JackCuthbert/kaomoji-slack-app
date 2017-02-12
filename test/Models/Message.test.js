const expect = require('chai').expect;
const Message = require('../../models/Message');
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

  it('returns a kaomoji', () => {
    const kaomoji = Message.chooseEmoji(fauxKaomoji);
    expect(fauxKaomoji.emoji.indexOf(kaomoji)).to.not.equal(-1);
  });
});

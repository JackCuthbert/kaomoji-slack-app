const expect = require('chai').expect;
const Kaomoji = require('../../services/Kaomoji');

describe('Kaomoji', () => {
  describe('#getKaomojiList', () => {
    it('returns the correct kaomoji file', () => {
      expect(Kaomoji.getKaomojiList('happy').title).to.equal('happy');
      expect(Kaomoji.getKaomojiList('pig').emoji.length).to.equal(100);
    });
  });

  describe('#buildString', () => {
    it('builds the correct message string');
  });

  describe('#chooseEmoji', () => {
    it('returns a kaomoji from array of kaomoji', () => {
      const fauxKaomoji = {
        emoji: ['( ͡° ͜ʖ ͡°)', '∠( ᐛ 」∠)＿', '(ﾟ⊿ﾟ)', 'ᕕ( ᐛ )ᕗ', '_へ__(‾◡◝ )>'],
      };

      const kaomoji = Kaomoji.chooseEmoji(fauxKaomoji);
      expect(fauxKaomoji.emoji.includes(kaomoji)).to.equal(true);
    });
  });

  describe('#resolveInput', () => {
    it('returns "happy" when associated text passed in', () => {
      expect(Kaomoji.resolveInput('glad')).to.equal('happy');
    });

    it('doesn\'t care about capitalization', () => {
      expect(Kaomoji.resolveInput('Glad')).to.equal('happy');
      expect(Kaomoji.resolveInput('UNHAPPY')).to.equal('sad');
    });

    it('returns "help" when no associated text is found', () => {
      expect(Kaomoji.resolveInput('blerg')).to.equal('help');
    });
  });
});

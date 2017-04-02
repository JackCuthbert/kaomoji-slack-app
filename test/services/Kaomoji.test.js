const expect = require('chai').expect;
const Kaomoji = require('../../services/Kaomoji');

describe('Kaomoji', () => {
  describe('#getKaomojiList', () => {
    it('returns the correct kaomoji file', () => {
      expect(Kaomoji.getKaomojiList('happy').title).to.equal('happy');
      expect(Kaomoji.getKaomojiList('pig').emoji.length).to.equal(100);
    });
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
      expect(Kaomoji.resolveInput('glad')[0].item).to.equal('happy');
    });

    it('doesn\'t care about capitalization', () => {
      expect(Kaomoji.resolveInput('Glad')[0].item).to.equal('happy');
      expect(Kaomoji.resolveInput('UNHAPPY')[0].item).to.equal('sad');
    });

    it('returns empty array when no matched text', () => {
      expect(Kaomoji.resolveInput('blerg').length).to.equal(0);
    });
  });

  describe('#buildMessage', () => {
    it('returns a string from a matched input', () => {
      expect(Kaomoji.buildMessage('happy')).to.be.a('string');
      expect(Kaomoji.buildMessage('happy with a sentence')).to.be.a('string');
      expect(Kaomoji.buildMessage('happy with a sentence')).to.include('with a sentence');
    });

    it('returns undefined when no file matched', () => {
      expect(Kaomoji.buildMessage('somestringwecantfind')).to.equal(undefined);
    });
  });
});

const sinon = require('sinon');
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

  describe('#buildMessage', () => {
    before(() => {
      // Need to make sure they way we're choosing emoji is reliably for tests
      sinon.stub(Math, 'floor').returns(4); // Totally random
    });

    it('returns the correct string', () => {
      expect(Kaomoji.buildMessage('happy', 'some_user')).to.equal('_へ__(‾◡◝ )>');
      expect(Kaomoji.buildMessage('happy with a sentence', 'some_user')).to.equal('with a sentence  _へ__(‾◡◝ )>');
    });

    it('returns undefined when no file matched', () => {
      expect(Kaomoji.buildMessage('somestringwecantfind', 'some_user')).to.equal(undefined);
    });
  });
});

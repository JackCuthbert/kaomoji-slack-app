const expect = require('chai').expect;
const Kaomoji = require('../../services/Kaomoji');

describe('Kaomoji', () => {
  // TODO: Move to microservice
  // describe('#getKaomojiList', () => {
  //   it('returns the correct kaomoji file', () => {
  //     expect(Kaomoji.getKaomojiList('happy').title).to.equal('happy');
  //     expect(Kaomoji.getKaomojiList('pig').emoji.length).to.equal(100);
  //   });
  // });

  // describe('#chooseEmoji', () => {
  //   it('returns a kaomoji from array of kaomoji', () => {
  //     const fauxKaomoji = {
  //       emoji: ['( ͡° ͜ʖ ͡°)', '∠( ᐛ 」∠)＿', '(ﾟ⊿ﾟ)', 'ᕕ( ᐛ )ᕗ', '_へ__(‾◡◝ )>'],
  //     };

  //     const kaomoji = Kaomoji.chooseEmoji(fauxKaomoji);
  //     expect(fauxKaomoji.emoji.includes(kaomoji)).to.equal(true);
  //   });
  // });

  // describe('#resolveInput', () => {
  //   it('returns "happy" when associated text passed in', () => {
  //     expect(Kaomoji.resolveInput('glad')[0].item).to.equal('happy');
  //   });

  //   it('doesn\'t care about capitalization', () => {
  //     expect(Kaomoji.resolveInput('Glad')[0].item).to.equal('happy');
  //     expect(Kaomoji.resolveInput('UNHAPPY')[0].item).to.equal('sad');
  //   });

  //   it('returns empty array when no matched text', () => {
  //     expect(Kaomoji.resolveInput('blerg').length).to.equal(0);
  //   });
  // });

  describe('#buildMessage', () => {
    it('returns a string from a matched input', (done) => {
      Kaomoji.buildMessage('happy')()
        .then((emoji) => {
          expect(emoji).to.be.a('string');
          done();
        });
    });

    it('returns a string from a matched input (with sentence)', (done) => {
      Kaomoji.buildMessage('happy with a sentence')()
        .then((emoji) => {
          expect(emoji).to.be.a('string');
          expect(emoji).to.include('with a sentence');
          done();
        });
    });

    it('returns undefined when no file matched', (done) => {
      Kaomoji.buildMessage('somestringwecantfind')()
        .then((emoji) => {
          expect(emoji).to.equal(undefined);
          done();
        });
    });
  });
});

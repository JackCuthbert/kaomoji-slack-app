const expect = require('chai').expect;
const Message = require('../../models/Message');
const kaomojiAsscLib = require('../../models/Kaomoji');

describe('Message', () => {
  describe('#getKaomojiList', () => {
    it('returns the correct kaomoji file', () => {
      expect(Message.getKaomojiList('happy').title).to.equal('happy');
      expect(Message.getKaomojiList('pig').emoji.length).to.equal(100);
    });
  });

  describe('#send', () => {
    it('sends the correct message object to slack');
  });

  describe('#buildString', () => {
    it('builds the correct message string');
  });

  describe('#resolveInput', () => {
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
});

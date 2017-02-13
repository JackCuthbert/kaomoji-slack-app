/* eslint no-unused-vars: 0 */
const sinon = require('sinon');
const expect = require('chai').expect;
const Message = require('../../services/Message');

describe('Message', () => {
  describe('#send', () => {
    it('sends the correct message object to slack');
  });

  describe('#buildString', () => {
    before(() => {
      // Need to make sure they way we're choosing emoji is reliably for tests
      sinon.stub(Math, 'floor').returns(4); // Totally random
    });

    it('returns the correct string', () => {
      expect(Message.buildString('happy', 'some_user')).to.equal('>>> _へ__(‾◡◝ )>\n\n_— <@some_user>_');
      expect(Message.buildString('happy with a sentence', 'some_user')).to.equal('>>> with a sentence  _へ__(‾◡◝ )>\n\n_— <@some_user>_');
    });

    it('returns undefined when no file matched', () => {
      expect(Message.buildString('somestringwecantfind', 'some_user')).to.equal(undefined);
    });
  });
});

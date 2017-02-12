const expect = require('chai').expect;
const resolveInput = require('../models/Message').resolveInput;
const kaomojiAsscLib = require('../models/Kaomoji');

describe('resolveInput', () => {
  it('returns "happy" when associated text passed in', () => {
    expect(resolveInput('glad', kaomojiAsscLib)).to.equal('happy');
  });

  it('doesn\'t care about capitalization', () => {
    expect(resolveInput('Glad', kaomojiAsscLib)).to.equal('happy');
    expect(resolveInput('UNHAPPY', kaomojiAsscLib)).to.equal('sad');
  });

  it('returns "help" if non-string passed in', () => {
    expect(resolveInput(42, kaomojiAsscLib)).to.equal('help');
  });

  it('returns "help" when no associated text is found', () => {
    expect(resolveInput('blerg', kaomojiAsscLib)).to.equal('help');
  });
});

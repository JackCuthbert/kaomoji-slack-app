const expect = require('chai').expect;
const Message = require('../../models/Message');

describe('Message', () => {
  it('returns the correct kaomoji file', () => {
    expect(Message.getKaomojiList('happy').title).to.equal('happy');
  });
});

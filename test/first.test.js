const expect = require('chai').expect;
const request = require('supertest');
const app = require('../server');

describe('first test', () => {
  it('returns 200', (done) => {
    request(app)
      .get('/connect')
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        done();
      });
  });
});

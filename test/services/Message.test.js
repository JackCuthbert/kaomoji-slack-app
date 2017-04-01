/* eslint no-unused-vars: 0 */
const sinon = require('sinon');
const expect = require('chai').expect;
const nock = require('nock');

const app = require('../../server');
const request = require('supertest')(app);

const Message = require('../../services/Message');

describe('Message', () => {
  describe('#send', () => {
    it('sends the correct message object to slack');
  });
});

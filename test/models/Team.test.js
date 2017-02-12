// const expect = require('chai').expect;
// const request = require('supertest');
// const app = require('../server');
// const nock = require('nock');
//
// const rewire = require('rewire');
//
// let Team = rewire('../models/Team');
//
// // Mock auth request
// nock('https://slack.com')
//   .post('/api/oauth.access', {
//     client_id: /.+/,
//     client_secret: /.+/,
//     code: '',
//   })
//   .reply(200, {
//     ok: true,
//     team_id: 'SOME_TEAM_ID',
//     access_token: 'SOME_ACCESS_TOKEN',
//     bot: {
//       bot_user_id: 'SOME_BOT_USER_ID',
//       bot_access_token: 'SOME_BOT_ACCESS_TOKEN',
//     },
//   });

describe('Team', () => {
  // before(() => {
  //
  // });

  describe('#find', () => {
    it('returns the team id and access token');
  });

  describe('#create', () => {
    it('creates a new team in the database');
    it('updates an existing team in the database');
  });
});

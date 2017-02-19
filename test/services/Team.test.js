const pg = require('pg');
const expect = require('chai').expect;
const nock = require('nock');
const setupDb = require('../lib/setupDb');

const Database = require('../../middleware/Database');
const app = require('../../server');
const request = require('supertest')(app);

const Team = require('../../services/Team');

before((done) => {
  setupDb(done);
});

describe('Team', () => {
  describe('#find', () => {
    it('returns the team id and access token', (done) => {
      const testClient = new pg.Client(Database.credentials());

      testClient.connect(() => {
        Team.find(testClient, 'test_team_id')
          .then((response) => {
            expect(response.team_id).to.equal('test_team_id');
            expect(response.access_token).to.equal('test_team_access_token');
            expect(response.updated_at).to.not.equal(null);

            testClient.end();
            done();
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      });
    });
  });

  describe('#create', () => {
    it('creates a new team in the database', (done) => {
      // Mock auth request
      nock('https://slack.com')
        .post('/api/oauth.access', {
          client_id: /.+/,
          client_secret: /.+/,
          code: '',
        })
        .reply(200, {
          ok: true,
          team_id: 'SOME_TEAM_ID',
          access_token: 'SOME_ACCESS_TOKEN',
          bot: {
            bot_user_id: 'SOME_BOT_USER_ID',
            bot_access_token: 'SOME_BOT_ACCESS_TOKEN',
          },
        });

      request
        .get('/connect')
        .expect(302)
        .end((err) => {
          if (err) throw err;

          const testClient = new pg.Client(Database.credentials());

          testClient.connect(() => {
            /* eslint quotes: 0 */
            testClient.query(`SELECT * FROM teams WHERE team_id = 'SOME_TEAM_ID';`)
              .then((result) => {
                expect(result.rows.length).to.equal(1);

                const row = result.rows[0];
                expect(row.team_id).to.equal('SOME_TEAM_ID');
                expect(row.access_token).to.equal('SOME_ACCESS_TOKEN');
                expect(row.bot_user_id).to.equal('SOME_BOT_USER_ID');
                expect(row.bot_access_token).to.equal('SOME_BOT_ACCESS_TOKEN');

                done();
              })
              .catch((selectErr) => {
                console.log(selectErr);
                throw selectErr;
              });
          });
        });
    });
    it('updates an existing team in the database', (done) => {
      // Mock auth request
      nock('https://slack.com')
        .post('/api/oauth.access', {
          client_id: /.+/,
          client_secret: /.+/,
          code: '',
        })
        .reply(200, {
          ok: true,
          team_id: 'test_team_id',
          access_token: 'new_access_token',
          bot: {
            bot_user_id: 'test_bot_user_id',
            bot_access_token: 'new_bot_access_token',
          },
        });
      request
        .get('/connect')
        .expect(302)
        .end((err) => {
          if (err) throw err;

          const testClient = new pg.Client(Database.credentials());

          testClient.connect(() => {
            testClient.query(`
              SELECT team_id, access_token, bot_user_id, bot_access_token
              FROM teams
              WHERE team_id = 'test_team_id';
            `)
              .then((result) => {
                expect(result.rows.length).to.equal(1);
                const row = result.rows[0];

                expect(row.team_id).to.equal('test_team_id');
                expect(row.access_token).to.equal('new_access_token');
                expect(row.bot_user_id).to.equal('test_bot_user_id');
                expect(row.bot_access_token).to.equal('new_bot_access_token');

                done();
              })
              .catch((selectErr) => {
                console.log(selectErr);
                throw selectErr;
              });
          });
        });
    });
  });
});

const pg = require('pg');
const expect = require('chai').expect;
const nock = require('nock');

const Database = require('../../middleware/Database');
const app = require('../../server');
const request = require('supertest')(app);

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

before((done) => {
  const testClient = new pg.Client(Database.credentials());

  testClient.connect(() => {
    testClient.query('DROP TABLE IF EXISTS teams;')
      .then(() => {
        testClient.query(`
          CREATE TABLE teams (
            id bigserial PRIMARY key,
            team_id varchar(20) NOT NULL,
            access_token text NOT NULL,
            bot_user_id varchar(20) NOT NULL,
            bot_access_token text NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT NULL,
            CONSTRAINT team_id_unique UNIQUE (team_id)
          );
        `)
        .then(() => {
          testClient.end();
        });
      })
      .then(() => {
        testClient.end();
        done();
      });
  });
});

describe('Team', () => {
  describe('#find', () => {
    it('returns the team id and access token');
  });

  describe('#create', () => {
    it('creates a new team in the database', (done) => {
      request
        .get('/connect')
        .expect(302)
        .end((err) => {
          if (err) throw err;

          const testClient = new pg.Client(Database.credentials());

          testClient.connect(() => {
            testClient.query('SELECT * FROM teams;')
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
              });
          });
        });
    });
    // it('updates an existing team in the database');
  });
});

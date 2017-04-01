const expect = require('chai').expect;
const nock = require('nock');

const app = require('../../server');
const request = require('supertest')(app);

const { db, Team } = require('../../config/models');

/* eslint arrow-body-style: 0 */
describe('Auth', () => {
  before((done) => {
    db.schema.dropTableIfExists('teams')
      .then(() => {
        return db.schema.createTable('teams', (t) => {
          t.increments('id').primary();
          t.string('team_id', 20).unique().notNullable();
          t.text('access_token').notNullable();
          t.timestamp('created_at').defaultTo(db.fn.now());
          t.timestamp('updated_at');
        });
      })
      .then(() => {
        return new Team({ team_id: 'test_team_id', access_token: 'test_team_access_token' }).save();
      })
      .then(() => {
        console.log('table seeded');
        done();
      })
      .catch(console.log);
  });

  describe('#addtoslack', () => {
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
        });

      request
        .get('/auth/callback')
        .expect(302)
        .end((err) => {
          if (err) throw err;

          Team.where({ team_id: 'SOME_TEAM_ID' })
            .fetchAll()
            .then((collection) => {
              expect(collection.length).to.equal(1);

              const team = collection.at(0);
              expect(team.attributes.team_id).to.equal('SOME_TEAM_ID');
              expect(team.attributes.access_token).to.equal('SOME_ACCESS_TOKEN');

              done();
            })
            .catch(console.log);
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
        });

      request
        .get('/auth/callback')
        .expect(302)
        .end((err) => {
          if (err) throw err;

          Team.where({ team_id: 'test_team_id' })
            .fetchAll()
            .then((collection) => {
              expect(collection.length).to.equal(1);

              const team = collection.at(0);
              console.log(team.attributes);

              expect(team.attributes.team_id).to.equal('test_team_id');
              expect(team.attributes.access_token).to.equal('new_access_token');

              done();
            });
        });
    });
  });
});

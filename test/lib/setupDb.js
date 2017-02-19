const pg = require('pg');
const Database = require('../../middleware/Database');

// Async database setup for
module.exports = (done) => {
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
          testClient.query(`
            INSERT INTO teams(team_id, access_token, bot_user_id, bot_access_token)
            VALUES('test_team_id', 'test_team_access_token', 'test_bot_user_id', 'test_bot_access_token')
          `)
          .then(() => {
            testClient.end();
          });
        });
      })
      .then(() => {
        done();
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

const pg = require('pg');

let client;

// Connect to the configured database
function connect() {
  client = new pg.Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_POST,
    ssl: {
      rejectUnauthorized: process.env.NODE_ENV === 'production',
    },
  });

  return new Promise((resolve, reject) => {
    client.connect((err) => {
      if (err) reject(err);
      resolve('Connected!');
    });
  })
  .catch((err) => {
    console.error(`Connect failed: ${err}`);
  });
}

// Find the team by id
// returns access_token and team_id
function find(teamId) {
  return connect()
    .then(() => (
      new Promise((resolve, reject) => {
        const query = 'SELECT team_id, access_token, bot_user_id, bot_access_token FROM teams WHERE team_id = $1';
        client.query({ text: query, values: [teamId] })
          .then((result) => {
            client.end((err) => {
              if (err) reject(err);
              resolve(result.rows[0]);
            });
          });
      })
    ));
}

// Create a new team in the database
// 1. Attempt to create the team with an upsert query
// 2. Otherwise, ┻━┻ ︵ ¯\ (ツ)/¯ ︵ ┻━┻
function create(teamId, accessToken, botUserId, botAccessToken) {
  return connect()
    .then(() => (
      new Promise((resolve, reject) => {
        const upsert = `
          INSERT INTO teams(team_id, access_token, bot_user_id, bot_access_token)
          VALUES($1, $2, $3, $4)
          ON CONFLICT (team_id)
          DO UPDATE SET access_token = $2, bot_user_id = $3, bot_access_token = $4, updated_at = current_timestamp
          RETURNING team_id;
        `;
        client.query({ text: upsert, values: [teamId, accessToken, botUserId, botAccessToken] })
          .then((createResult) => {
            client.end((err) => {
              if (err) reject(err);
              resolve(`Team Created: ${createResult.rows[0].team_id}`);
            });
          });
      })
    ));
}

exports.create = create;
exports.connect = connect;
exports.find = find;

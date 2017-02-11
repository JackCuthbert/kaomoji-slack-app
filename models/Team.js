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
    .then(() => {
      return new Promise((resolve, reject) => {
        const query = 'SELECT team_id, access_token FROM teams WHERE team_id = $1';
        client.query({ text: query, values: [teamId] })
          .then((result) => {
            client.end((err) => {
              if (err) reject(err);
              resolve(result.rows[0]);
            });
          });
      });
    });
}

// Create a new team in the database

// 1. Attempt to create the team
// 2. If it fails with a duplicate key error perform an update operation
// 3. Otherwise, ┻━┻ ︵ ¯\ (ツ)/¯ ︵ ┻━┻
exports.create = (teamId, accessToken) => {
  return connect()
    .then(() => {
      return new Promise((resolve, reject) => {
        const query = 'INSERT INTO teams(team_id, access_token) VALUES($1, $2) RETURNING team_id';
        client.query({ text: query, values: [teamId, accessToken] })
          .then((createResult) => {
            client.end((err) => {
              if (err) reject(err);
              resolve(`Team Created: ${createResult.rows[0].team_id}`);
            });
          })
          // TODO: Clean this up
          .catch((queryError) => {
            // If there's a duplicate team id, perform an update with the new access token
            if (queryError.code === '23505') {
              console.log('create() failed, updating...');
              const updateQuery = 'UPDATE teams SET access_token = $1 WHERE team_id = $2 RETURNING team_id';

              client.query({ text: updateQuery, values: [accessToken, teamId] })
                .then((updateResult) => {
                  client.end((err) => {
                    if (err) reject(err);
                    resolve(`Team updated: ${updateResult.rows[0].team_id}`);
                  });
                });
            } else {
              reject(queryError);
            }
          });
      });
    });
};

exports.find = find;

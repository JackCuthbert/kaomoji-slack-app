const pg = require('pg');

const client = new pg.Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_POST,
  ssl: {
    rejectUnauthorized: process.env.NODE_ENV === 'production',
  },
});

function connect() {
  return new Promise((resolve, reject) => {
    client.connect((err) => {
      if (err) {
        reject(err);
      }
      resolve('Connected!');
    });
  });
}

// Find the team by id
const find = (teamId) => {
  return connect()
    .then(() => {
      return new Promise((resolve, reject) => {
        const query = 'SELECT team_id, access_token FROM teams WHERE team_id = $1';
        client.query({ text: query, values: [teamId] }, (queryError, result) => {
          if (queryError) reject(queryError);

          client.end((err) => {
            if (err) reject(err);
            resolve(result.rows[0]);
          });
        });
      });
    });
};

// Create a new team in the database

// Attemped to create the team, if it fails with a duplicate key perform an update
// operation
exports.create = (teamId, accessToken) => {
  return connect()
    .then(() => {
      return new Promise((resolve, reject) => {
        const query = 'INSERT INTO teams(team_id, access_token) VALUES($1, $2) RETURNING team_id';
        client.query({ text: query, values: [teamId, accessToken] }, (queryError, createResult) => {
          if (queryError) {
            // If there's a duplicate team id, perform an update with the new access token
            if (queryError.code === '23505') {
              const updateQuery = 'UPDATE teams SET access_token = $1 WHERE team_id = $2 RETURNING team_id';

              client.query({ text: updateQuery, values: [accessToken, teamId] }, (updateError, updateResult) => {
                if (updateError) reject(updateError);
                client.end((err) => {
                  if (err) reject(err);
                  resolve(`Team updated: ${updateResult.rows[0].team_id}`);
                });
              });
            } else {
              reject(queryError);
            }
          } else {
            client.end((err) => {
              if (err) reject(err);
              resolve(`Team Created: ${createResult.rows[0].team_id}`);
            });
          }
        });
      });
    });
};

exports.find = find;

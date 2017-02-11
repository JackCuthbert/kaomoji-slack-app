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
        console.error(err);
        reject(err);
      }
      resolve('Connected!');
    });
  });
}

// https://github.com/brianc/node-postgres
exports.create = (teamId, accessToken) => {
  return connect()
    .then(() => {
      return new Promise((resolve, reject) => {
        const query = 'INSERT INTO teams(team_id, access_token) VALUES($1, $2) RETURNING id';
        client.query({ text: query, values: [teamId, accessToken] }, (queryError, result) => {
          if (queryError) reject(queryError);

          client.end((err) => {
            if (err) reject(err);
            resolve(`Team Created: ${result.rows[0].id}`);
          });
        });
      });
    });
};

exports.find = (teamId) => {
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

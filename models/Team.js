// Find the team by id
// returns access_token and team_id
function find(client, teamId) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT team_id, access_token, bot_user_id, bot_access_token FROM teams WHERE team_id = $1';
    client.query({ text: query, values: [teamId] })
      .then((result) => {
        resolve(result.rows[0]);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// Create a new team in the database
// 1. Attempt to create the team with an upsert query
// 2. Otherwise, ┻━┻ ︵ ¯\ (ツ)/¯ ︵ ┻━┻
function create(client, teamId, accessToken, botUserId, botAccessToken) {
  return new Promise((resolve, reject) => {
    const upsert = `
      INSERT INTO teams(team_id, access_token, bot_user_id, bot_access_token)
      VALUES($1, $2, $3, $4)
      ON CONFLICT (team_id)
      DO UPDATE SET access_token = $2, bot_user_id = $3, bot_access_token = $4, updated_at = current_timestamp
      RETURNING team_id;
    `;
    client.query({ text: upsert, values: [teamId, accessToken, botUserId, botAccessToken] })
      .then((createResult) => {
        resolve(`Team Created: ${createResult.rows[0].team_id}`);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = {
  create,
  find,
};

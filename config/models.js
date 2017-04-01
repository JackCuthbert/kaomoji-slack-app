const knex = require('knex');

let db;

/* eslint no-use-before-define: 0 */
if (process.env.NODE_ENV === 'test') {
  db = knex({
    client: 'pg',
    connection: 'postgresql://postgres@localhost/kaomoji_test',
    pool: { min: 0, max: 2 },
  });
} else {
  db = knex({
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: { min: 0, max: 10 },
  });
}

const bookshelf = require('bookshelf')(db);

const Team = bookshelf.Model.extend({
  tableName: 'teams',
  hasTimestamps: ['created_at', 'updated_at'],
});

const Stat = bookshelf.Model.extend({
  tableName: 'stats',
  hasTimestamps: false,
});

exports.Team = Team;
exports.Stat = Stat;
exports.db = db;

const pg = require('pg');
const onFinished = require('on-finished');

exports.credentials = () => {
  if (process.env.NODE_ENV === 'test') {
    return {
      user: 'postgres',
      password: '',
      database: 'kaomoji_test',
      host: 'localhost',
      post: process.env.DB_PORT,
    };
  }

  return {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  };
};

exports.pool = () => {
  const pool = new pg.Pool(Object.assign({}, {
    max: 10,
    idleTimeoutMillis: 30000,
  }, this.credentials()));

  // Return a new client from the connection pool upon each request
  return (req, res, next) => {
    pool.connect()
      .then((client) => {
        /* eslint no-param-reassign: 0*/
        req.dbClient = client;

        // Clean up the client when the request is finished
        onFinished(res, (finishedErr) => {
          if (finishedErr) {
            console.error(finishedErr);
          }

          client.release();
        });

        next();
      })
      .catch((err) => {
        next(err);
      });
  };
};

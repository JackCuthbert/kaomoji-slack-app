const pg = require('pg');
const onFinished = require('on-finished');

module.exports = function database(options) {
  const pool = new pg.Pool(Object.assign({}, {
    max: 20,
    idleTimeoutMillis: 30000,
  }, options));

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

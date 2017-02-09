const http = require('http');

const Team = require('../../models/Team');

exports.index = (req, res) => {
  res.send('auth controller');
};

exports.callback = (req, res) => {
  res.send('auth callback controller');
};

// TODO: Move somewhere that makes sense
exports.createTeam = (req, res) => {
  // TODO: Get real data
  Team.create('TEAM001', 'SOME_ACCESS_TOKEN')
    .then((msg) => {
      res.send(msg);
    })
    .catch((err) => {
      console.error(err);
      res.send(err);
    });
};

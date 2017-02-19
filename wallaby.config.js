module.exports = () => ({
  files: [{
    pattern: 'services/**/*.js',
    load: true,
  }, {
    pattern: 'kaomoji/*.json',
    load: true,
  }, {
    pattern: 'middleware/**/*.js',
    load: true,
  }, {
    pattern: 'server.js',
    load: true,
  }, {
    pattern: 'controllers/**/*.js',
    load: true,
  }],
  tests: [{
    pattern: 'test/**/*.test.js',
    load: true,
  }],
  env: {
    type: 'node',
  },
  debug: true,
});

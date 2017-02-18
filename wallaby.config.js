module.exports = () => ({
  files: [{
    pattern: 'services/**/*.js',
    load: true,
  }, {
    pattern: 'kaomoji/*.json',
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

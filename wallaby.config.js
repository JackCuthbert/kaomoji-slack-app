module.exports = () => ({
  files: [
    'services/**/*.js',
  ],
  tests: [
    'test/**/*.test.js',
  ],
  env: {
    type: 'node',
  },
  debug: true,
});

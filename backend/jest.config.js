module.exports = {
  moduleFileExtensions: ['js', 'json'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.js$',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/main.js',
    '!src/**/*.module.js',
    '!src/**/index.js',
  ],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testTimeout: 10000,
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
};

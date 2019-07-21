module.exports = {
  name: 'test-sites',
  preset: "jest-puppeteer",
  testEnvironment: "jest-environment-puppeteer",
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    "^.+\\.(js|jsx|mjs)$": "../node_modules/babel-jest"
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};

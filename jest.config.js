/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  //preset: 'ts-jest',
  testEnvironment: 'node',
  //transform: {
  //  "^.+\\.tsx?$": "ts-jest",
  //},
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  testPathIgnorePatterns: ["/lib/", "/node_modules/"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverage: true,
};
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.test.ts?$": [
      "ts-jest",
      {
        diagnostics: {
          exclude: ["**"],
        },
      },
    ],
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
}

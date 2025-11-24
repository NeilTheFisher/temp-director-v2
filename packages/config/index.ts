import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import arkenv from "arkenv";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

const rootDir = path.join(fileURLToPath(new URL(import.meta.url)), "../../../");
const nodeEnv = process.env.NODE_ENV || "development";

// Load base .env first
const baseEnvPath = path.join(rootDir, ".env");
const dotenvResult = dotenvExpand.expand(
  dotenv.config({
    path: baseEnvPath,
    quiet: true,
  }),
);

// Load environment-specific .env file if it exists and merge
const envSpecificPath = path.join(rootDir, `.env.${nodeEnv}`);
if (existsSync(envSpecificPath)) {
  const envSpecificResult = dotenvExpand.expand(
    dotenv.config({
      path: envSpecificPath,
      quiet: true,
    }),
  );
  if (envSpecificResult.parsed && dotenvResult.parsed) {
    Object.assign(dotenvResult.parsed, envSpecificResult.parsed);
  }
}

export const env = arkenv(
  {
    AWS_URL: "string.url",
    DATABASE_URL: "string.url",
    DIRECTOR_URL: "string.url",
    "DIRECTOR_TEST_USER_EMAIL?": "string.email",
    "DIRECTOR_TEST_USER_PASSWORD?": "string",
    REDIS_URL: "string.url",
  },
  dotenvResult.parsed,
);

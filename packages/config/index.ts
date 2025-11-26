import path from "node:path";
import { fileURLToPath } from "node:url";
import arkenv, { type } from "arkenv";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

const rootDir = path.join(fileURLToPath(new URL(import.meta.url)), "../../../");
const nodeEnv = process.env.NODE_ENV || process.env.ENV || "development";

// Load base .env first
const baseEnvPath = path.join(rootDir, ".env");
const dotenvResult = dotenvExpand.expand(
  dotenv.config({
    path: baseEnvPath,
    quiet: true,
  }),
);

if (!dotenvResult.parsed) {
  throw new Error(`Failed to load base .env file at path: ${baseEnvPath}`);
}

Object.assign(dotenvResult.parsed, {
  ENV: nodeEnv,
});
Object.assign(process.env, {
  ENV: nodeEnv,
});

const envType = type({
  AWS_URL: "string.url",
  DATABASE_URL: "string.url",
  DIRECTOR_URL: "string.url",
  DIRECTOR_TEST_USER_EMAIL: type("string.email").optional(),
  DIRECTOR_TEST_USER_PASSWORD: type("string").optional(),
  REDIS_URL: "string.url",
  ENV: "'development' | 'production' | 'test'",
  SENTRY_DSN: type("string.url").optional(),
  ACS_API_ENDPOINT: type("string").optional(),
  ACS_PROVISIONING_PATH: type("string").optional(),
  ACS_API_IMPU_TEMPLATE: type("string").optional(),
  ACS_API_IMPI_TEMPLATE: type("string").optional(),
  WLZ_BELL_PASSWORD: type("string").optional(),
  PROTEUS_IAM_ACCESS_KEY_ID: type("string").optional(),
  PROTEUS_IAM_SECRET_ACCESS_KEY: type("string").optional(),
  PROTEUS_IAM_DEFAULT_REGION: type("string").optional(),
  PROTEUS_SERVICE: type("string").optional(),
  PROTEUS_HOST: type("string").optional(),
  PROTEUS_URI: type("string").optional(),
  DIRECTOR_PUBLIC_IP: type("string").optional(),
});

export const envClean = arkenv(envType, dotenvResult.parsed);
export const env = arkenv(envType, process.env);

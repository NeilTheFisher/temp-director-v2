import path from "node:path";
import { fileURLToPath } from "node:url";
import arkenv from "arkenv";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

const rootDir = path.join(fileURLToPath(new URL(import.meta.url)), "../../../");
const nodeEnv = process.env.NODE_ENV || process.env.ENV || "development";

// Load base .env first
const baseEnvPath = path.join(rootDir, ".env");
dotenvExpand.expand(
  dotenv.config({
    path: baseEnvPath,
    quiet: true,
  }),
);

Object.assign(process.env, {
  ENV: nodeEnv,
});

const {
  NODE_ENV: _NODE_ENV,
  NEXT_RUNTIME: _NEXT_RUNTIME,
  NODE_OPTIONS: _NODE_OPTIONS,
  NODE_EXTRA_CA_CERTS: _NODE_EXTRA_CA_CERTS,
  __NEXT_PRIVATE_ORIGIN: ___NEXT_PRIVATE_ORIGIN,
  __NEXT_EXPERIMENTAL_HTTPS: ___NEXT_EXPERIMENTAL_HTTPS,
  ...processedEnv
} = process.env;

export const env = arkenv(
  {
    AWS_URL: "string.url",
    DATABASE_URL: "string.url",
    DIRECTOR_URL: "string.url",
    "DIRECTOR_TEST_USER_EMAIL?": "string.email",
    "DIRECTOR_TEST_USER_PASSWORD?": "string",
    REDIS_URL: "string.url",
    ENV: "'development' | 'production' | 'test'",
  },
  processedEnv,
);

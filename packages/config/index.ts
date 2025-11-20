import path from "node:path";
import { fileURLToPath } from "node:url";
import arkenv from "arkenv";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

if (!process.env.NODE_ENV?.startsWith("prod")) {
  const envPath = path.join(
    fileURLToPath(new URL(import.meta.url)),
    "../../../.env",
  );

  console.log("Loading env vars from", envPath);

  dotenvExpand.expand(
    dotenv.config({
      path: envPath,
    }),
  );
}

console.log("process.env.AWS_URL", process.env.AWS_URL);

export const env = arkenv({
  AWS_URL: "string.url",
  DATABASE_URL: "string.url",
  DIRECTOR_URL: "string.url",
  DIRECTOR_TEST_USER_EMAIL: "string.email = 'admin@summit-tech.ca'",
  DIRECTOR_TEST_USER_PASSWORD: "string = 'summit123'",
  REDIS_URL: "string.url",
});

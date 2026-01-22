import path from "path";
import { fileURLToPath } from "url";

import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

export function loadEnv() {
  const rootDir = path.join(fileURLToPath(new URL(import.meta.url)), "../../../../");
  const baseEnvPath = path.join(rootDir, ".env");

  const nodeEnv = process.env.NODE_ENV || process.env.ENV || "development";

  dotenvExpand.expand(
    dotenv.config({
      path: baseEnvPath,
      quiet: true,
    })
  );

  Object.assign(process.env, {
    ENV: nodeEnv,
  });

  return process.env;
}

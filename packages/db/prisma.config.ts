import path from "node:path";

import { env } from "@director_v2/env/server";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join("prisma", "schema"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    url: env.DATABASE_URL,
  },
});

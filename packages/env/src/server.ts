import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

import { loadEnv } from "./load-env";

export const env = createEnv({
  server: {
    AWS_URL: z.url(),
    DATABASE_URL: z.url(),
    DIRECTOR_URL: z.url(),
    DIRECTOR_TEST_USER_EMAIL: z.email().optional(),
    DIRECTOR_TEST_USER_PASSWORD: z.string().optional(),
    REDIS_URL: z.url(),
    ENV: z.enum(["development", "production", "test"]).default("development"),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    SENTRY_DSN: z.union([z.url(), z.literal("")]).optional(),
    ACS_API_ENDPOINT: z.string().optional(),
    ACS_PROVISIONING_PATH: z.string().optional(),
    ACS_API_IMPU_TEMPLATE: z.string().optional(),
    ACS_API_IMPI_TEMPLATE: z.string().optional(),
    WLZ_BELL_PASSWORD: z.string().optional(),
    PROTEUS_IAM_ACCESS_KEY_ID: z.string().optional(),
    PROTEUS_IAM_SECRET_ACCESS_KEY: z.string().optional(),
    PROTEUS_IAM_DEFAULT_REGION: z.string().optional(),
    PROTEUS_SERVICE: z.string().optional(),
    PROTEUS_HOST: z.string().optional(),
    PROTEUS_URI: z.string().optional(),
    DIRECTOR_PUBLIC_IP: z.string().optional(),
  },
  runtimeEnv: loadEnv(),
  emptyStringAsUndefined: true,
});

import { env } from "@director_v2/config";
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: env.SENTRY_DSN,
  environment: env.ENV,
  tracesSampleRate: 0.1,
  debug: false,
});

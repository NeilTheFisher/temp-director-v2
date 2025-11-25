import { env } from "@director_v2/config";
import { PrismaInstrumentation } from "@prisma/instrumentation";
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: env.SENTRY_DSN,
  environment: env.ENV,
  tracesSampleRate: 0.1,
  debug: false,
  integrations: [Sentry.prismaIntegration()],
  // Uses experimental Sentry API for OpenTelemetry instrumentation
  registerEsmLoaderHooks: { onlyIncludeInstrumentedModules: true },
  _experiments: {
    openTelemetryInstrumentations: [new PrismaInstrumentation()],
  },
});

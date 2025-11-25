import * as Sentry from "@sentry/nextjs";
import { PrismaInstrumentation } from "@prisma/instrumentation";

Sentry.init({
	dsn: process.env.SENTRY_DSN,
	environment: process.env.NODE_ENV,

	// Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
	// We recommend adjusting this value in production.
	tracesSampleRate: 1.0,

	// Setting this option to true will print useful information to the console while you're setting up Sentry.
	debug: false,

	// Enable Prisma tracing
	integrations: [Sentry.prismaIntegration()],

	// Register Prisma instrumentation for OpenTelemetry-based tracing
	registerEsmLoaderHooks: { onlyIncludeInstrumentedModules: true },
	_experiments: {
		openTelemetryInstrumentations: [new PrismaInstrumentation()],
	},
});

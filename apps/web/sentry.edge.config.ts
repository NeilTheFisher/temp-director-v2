import * as Sentry from "@sentry/nextjs";

Sentry.init({
	dsn: process.env.SENTRY_DSN,
	environment: process.env.NODE_ENV,

	// Adjust tracesSampleRate in production - defaults to 0.1 (10%) if not set
	tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE) || 0.1,

	// Setting this option to true will print useful information to the console while you're setting up Sentry.
	debug: false,
});

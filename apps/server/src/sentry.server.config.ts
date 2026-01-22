import { env } from "@director_v2/config";
import { SpanStatusCode, trace } from "@opentelemetry/api";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { BatchSpanProcessor, SimpleSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { ORPCInstrumentation } from "@orpc/otel";
import { PrismaInstrumentation } from "@prisma/instrumentation";
import * as Sentry from "@sentry/node";
import { SentryPropagator, SentrySampler, SentrySpanProcessor } from "@sentry/opentelemetry";

const sentryClient = Sentry.init({
  dsn: env.SENTRY_DSN,
  environment: env.ENV,
  serverName: "director-api",

  tracesSampleRate: env.ENV === "development" ? 1.0 : 0.25,
  // debug: env.ENV === "development",
  attachStacktrace: true,
  sendDefaultPii: env.ENV === "development",

  defaultIntegrations: false,
  skipOpenTelemetrySetup: true,
});

const OTEL_TRACE_EXPORTER_URL =
  process.env.OTEL_TRACE_EXPORTER_URL || "http://localhost:4318/v1/traces";

const traceExporter = new OTLPTraceExporter({
  url: OTEL_TRACE_EXPORTER_URL,
});

const otelSdk = new NodeSDK({
  resource: resourceFromAttributes({
    "service.name": "director",
  }),
  sampler: sentryClient ? new SentrySampler(sentryClient) : undefined,
  spanProcessors: [
    process.env.NODE_ENV === "development"
      ? new SimpleSpanProcessor(traceExporter)
      : new BatchSpanProcessor(traceExporter),
    new SentrySpanProcessor(),
  ],
  instrumentations: [
    getNodeAutoInstrumentations({
      "@opentelemetry/instrumentation-http": {
        enabled: false,
      },
      "@opentelemetry/instrumentation-ioredis": {
        enabled: true,
        requireParentSpan: false,
      },
    }),
    new ORPCInstrumentation(),
    new PrismaInstrumentation(),
  ],
  textMapPropagator: new SentryPropagator(),
  contextManager: new Sentry.SentryContextManager(),
});

otelSdk.start();

const tracer = trace.getTracer("uncaught-errors");

function recordError(eventName: string, reason: unknown) {
  const span = tracer.startSpan(eventName);
  const message = String(reason);

  if (reason instanceof Error) {
    span.recordException(reason);
  } else {
    span.recordException({ message });
  }

  span.setStatus({ code: SpanStatusCode.ERROR, message });
  span.end();
}

process.on("uncaughtException", (reason) => {
  recordError("uncaughtException", reason);
  Sentry.captureException(reason);
  console.error("Uncaught Exception:\n", reason);
});

process.on("unhandledRejection", (reason) => {
  recordError("unhandledRejection", reason);
  Sentry.captureException(reason);
  console.error("Unhandled Rejection:\n", reason);
});

Sentry.validateOpenTelemetrySetup();

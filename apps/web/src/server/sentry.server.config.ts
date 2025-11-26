import { env } from "@director_v2/config";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { ORPCInstrumentation } from "@orpc/otel";
import { PrismaInstrumentation } from "@prisma/instrumentation";
import * as Sentry from "@sentry/node";

// class CustomOTLPTraceExporter extends OTLPTraceExporter {
//   // biome-ignore lint/suspicious/noExplicitAny: don't feel like doing `import { ExportResult } from '@opentelemetry/core';`
//   export(spans: ReadableSpan[], resultCallback: (result: any) => void): void {
//     // fix span name for Next.js API routes like /api/[[...rest]]
//     // readonly span but writing it anyway works
//     for (const span of spans) {
//       if (!span.attributes["http.target"]) continue;
//       Object.assign(span, { name: span.attributes["http.target"] });
//     }

//     super.export(spans, resultCallback);
//   }
// }

function getDevSpanProcessors() {
  if (env.ENV !== "development") return [];

  const OTEL_TRACE_EXPORTER_URL =
    process.env.OTEL_TRACE_EXPORTER_URL || "http://localhost:4318/v1/traces";
  const traceExporter = new OTLPTraceExporter({
    url: OTEL_TRACE_EXPORTER_URL,
  });
  return [new SimpleSpanProcessor(traceExporter)];
}

Sentry.init({
  dsn: env.SENTRY_DSN,
  environment: env.ENV,
  serverName: "director-api",

  tracesSampleRate: env.ENV === "development" ? 1.0 : 0.25,
  // debug: env.ENV === "development",
  attachStacktrace: true,
  sendDefaultPii: env.ENV === "development",

  defaultIntegrations: false,
  openTelemetryInstrumentations: [
    ...getNodeAutoInstrumentations({
      "@opentelemetry/instrumentation-http": {
        enabled: false,
      },
    }),
    new ORPCInstrumentation(),
    new PrismaInstrumentation(),
  ],
  openTelemetrySpanProcessors: [...getDevSpanProcessors()],
});

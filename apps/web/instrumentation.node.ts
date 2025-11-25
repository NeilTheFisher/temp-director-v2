import { SpanStatusCode, trace } from "@opentelemetry/api";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { PinoInstrumentation } from "@opentelemetry/instrumentation-pino";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { NodeSDK } from "@opentelemetry/sdk-node";
import {
  BatchSpanProcessor,
  type ReadableSpan,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-node";
import { ORPCInstrumentation } from "@orpc/otel";
import { PrismaInstrumentation } from "@prisma/instrumentation";

const OTEL_TRACE_EXPORTER_URL =
  process.env.OTEL_TRACE_EXPORTER_URL || "http://localhost:4318/v1/traces";
class CustomOTLPTraceExporter extends OTLPTraceExporter {
  // biome-ignore lint/suspicious/noExplicitAny: don't feel like doing `import { ExportResult } from '@opentelemetry/core';`
  export(spans: ReadableSpan[], resultCallback: (result: any) => void): void {
    // fix span name for Next.js API routes like /api/[[...rest]]
    // readonly span but writing it anyway works
    for (const span of spans) {
      if (!span.attributes["http.target"]) continue;
      Object.assign(span, { name: span.attributes["http.target"] });
    }

    super.export(spans, resultCallback);
  }
}

const traceExporter = new CustomOTLPTraceExporter({
  url: OTEL_TRACE_EXPORTER_URL,
});

const otelSdk = new NodeSDK({
  resource: resourceFromAttributes({
    "service.name": "director",
  }),
  spanProcessors: [
    process.env.NODE_ENV === "development"
      ? new SimpleSpanProcessor(traceExporter)
      : new BatchSpanProcessor(traceExporter),
  ],
  instrumentations: [
    getNodeAutoInstrumentations(),
    new ORPCInstrumentation(),
    new PrismaInstrumentation(),
    new PinoInstrumentation(),
  ],
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
});

process.on("unhandledRejection", (reason) => {
  recordError("unhandledRejection", reason);
});

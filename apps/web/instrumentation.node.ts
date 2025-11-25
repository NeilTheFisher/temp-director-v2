import { SpanStatusCode, trace } from "@opentelemetry/api";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { PinoInstrumentation } from "@opentelemetry/instrumentation-pino";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { NodeSDK } from "@opentelemetry/sdk-node";
import {
  BatchSpanProcessor,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-node";
import { ORPCInstrumentation } from "@orpc/otel";
import { PrismaInstrumentation } from "@prisma/instrumentation";

const OTEL_TRACE_EXPORTER_URL =
  process.env.OTEL_TRACE_EXPORTER_URL || "http://localhost:4318/v1/traces";

const traceExporter = new OTLPTraceExporter({
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

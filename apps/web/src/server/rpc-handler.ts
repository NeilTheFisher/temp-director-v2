import type { IncomingMessage, ServerResponse } from "node:http";
import { appRouter, createContext } from "@director_v2/api";
import { generateTestToken } from "@director_v2/api/util/generate-test-token";
import { env } from "@director_v2/config";
import { experimental_ArkTypeToJsonSchemaConverter as ArkTypeToJsonSchemaConverter } from "@orpc/arktype";
import { LoggingHandlerPlugin } from "@orpc/experimental-pino";
import { experimental_SmartCoercionPlugin as SmartCoercionPlugin } from "@orpc/json-schema";
import { OpenAPIHandler } from "@orpc/openapi/node";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { CompressionPlugin, RPCHandler } from "@orpc/server/node";
import {
  SimpleCsrfProtectionHandlerPlugin,
  StrictGetMethodPlugin,
} from "@orpc/server/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import * as Sentry from "@sentry/nextjs";
import pino from "pino";
import pretty from "pino-pretty";
import { version } from "../../package.json";

const stream = pretty({
  colorize: true,
});
const logger = pino({ level: "debug" }, stream);

declare global {
  var log: typeof logger;
}
globalThis.log = logger;

const sharedPlugins = [
  new CompressionPlugin(),
  new LoggingHandlerPlugin({
    logger,
    generateId: ({ context }) =>
      context.session
        ? `user-${context.session?.user.id}_${crypto.randomUUID()}`
        : crypto.randomUUID(),
    // logRequestResponse: true,
    // logRequestAbort: true,
  }),
];

const rpcHandler = new RPCHandler(appRouter, {
  interceptors: [
    onError((error) => {
      Sentry.captureException(error);
      console.error(error);
    }),
  ],
  plugins: [
    ...sharedPlugins,

    new SimpleCsrfProtectionHandlerPlugin(),
    new StrictGetMethodPlugin(),
  ],
});

const schemaConverters = [
  new ZodToJsonSchemaConverter(),
  new ArkTypeToJsonSchemaConverter(),
];
const apiHandler = new OpenAPIHandler(appRouter, {
  interceptors: [
    onError((error) => {
      Sentry.captureException(error);
      console.error(error);
    }),
  ],
  plugins: [
    ...sharedPlugins,

    new OpenAPIReferencePlugin({
      docsPath: "/api-reference",
      schemaConverters,
      specGenerateOptions: ({ request }) => ({
        info: {
          title: "Director API Reference",
          version: version,
        },
        servers: [
          { url: `${request.url.origin}` },
          { url: `${env.DIRECTOR_URL}` },
          { url: "https://director.odience.com" },
        ],
        security: [{ bearerAuth: [] }],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
            },
          },
        },
      }),
      docsConfig: {
        persistAuth: true,
        authentication: {
          securitySchemes: {
            bearerAuth: {
              token:
                env.ENV === "development" ? generateTestToken() : undefined,
            },
          },
        },
      },
    }),
    new SmartCoercionPlugin({
      schemaConverters,
    }),
  ],
});

/**
 * Handle oRPC requests
 * @param req - The incoming request
 * @returns Response if handled, null otherwise
 */
export async function handleRPC(req: IncomingMessage, res: ServerResponse) {
  const context = await createContext(req);

  const rpcResult = await rpcHandler.handle(req, res, {
    prefix: "/api/rpc",
    context,
  });
  if (rpcResult.matched) return true;

  const apiResult = await apiHandler.handle(req, res, {
    prefix: "/",
    context,
  });
  if (apiResult.matched) return true;

  return false;
}

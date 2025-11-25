// polyfill for CompressionStream https://github.com/oven-sh/bun/issues/1723
import "@ungap/compression-stream/poly";

import { appRouter, createContext } from "@director_v2/api";
import { generateTestToken } from "@director_v2/api/util/generate-test-token";
import { env } from "@director_v2/config";
import { experimental_ArkTypeToJsonSchemaConverter as ArkTypeToJsonSchemaConverter } from "@orpc/arktype";
import { LoggingHandlerPlugin } from "@orpc/experimental-pino";
import { experimental_SmartCoercionPlugin as SmartCoercionPlugin } from "@orpc/json-schema";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { CompressionPlugin, RPCHandler } from "@orpc/server/fetch";
import {
  SimpleCsrfProtectionHandlerPlugin,
  StrictGetMethodPlugin,
} from "@orpc/server/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import type { NextRequest } from "next/server";
import pino from "pino";
import pretty from "pino-pretty";
import { version } from "../../../../package.json";

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
    logRequestResponse: true,
    logRequestAbort: true,
  }),
];

const rpcHandler = new RPCHandler(appRouter, {
  interceptors: [
    onError((error) => {
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
  plugins: [
    ...sharedPlugins,

    new OpenAPIReferencePlugin({
      schemaConverters,
      specGenerateOptions: ({ request }) => ({
        info: {
          title: "Director API Reference",
          version: version,
        },
        servers: [
          { url: `${request.url.origin}/api` },
          { url: `${env.DIRECTOR_URL}/api` },
          { url: "https://director.odience.com/api" },
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
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

async function handleRequest(req: NextRequest) {
  const rpcResult = await rpcHandler.handle(req, {
    prefix: "/api/rpc",
    context: await createContext(req),
  });
  if (rpcResult.response) return rpcResult.response;

  const apiResult = await apiHandler.handle(req, {
    prefix: "/api",
    context: await createContext(req),
  });
  if (apiResult.response) return apiResult.response;

  return new Response("Not found", { status: 404 });
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;

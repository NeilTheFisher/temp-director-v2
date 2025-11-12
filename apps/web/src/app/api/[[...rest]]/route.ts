import { appRouter, createContext } from "@director_v2/api";
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
// polyfill for CompressionStream https://github.com/oven-sh/bun/issues/1723
import "@ungap/compression-stream/poly";
import { experimental_SmartCoercionPlugin as SmartCoercionPlugin } from "@orpc/json-schema";

const rpcHandler = new RPCHandler(appRouter, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
  plugins: [
    new CompressionPlugin(),

    new SimpleCsrfProtectionHandlerPlugin(),
    new StrictGetMethodPlugin(),
  ],
});

const schemaConverters = [new ZodToJsonSchemaConverter()];
const apiHandler = new OpenAPIHandler(appRouter, {
  plugins: [
    new CompressionPlugin(),

    new OpenAPIReferencePlugin({
      schemaConverters,
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
    context: await createContext(
      req as unknown as Parameters<typeof createContext>[0],
    ),
  });
  if (rpcResult.response) return rpcResult.response;

  const apiResult = await apiHandler.handle(req, {
    prefix: "/api",
    context: await createContext(
      req as unknown as Parameters<typeof createContext>[0],
    ),
  });
  if (apiResult.response) return apiResult.response;

  return new Response("Not found", { status: 404 });
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;

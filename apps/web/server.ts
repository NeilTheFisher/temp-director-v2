// polyfill for CompressionStream https://github.com/oven-sh/bun/issues/1723
import "@ungap/compression-stream/poly";

import { networkInterfaces } from "node:os";
import { env } from "@director_v2/config";
import { preconnectToDbAndRedis } from "@director_v2/db";
import { toFetchResponse, toReqRes } from "fetch-to-node";
import next from "next";
import nextConfig from "./next.config";
import { handleRPC } from "./src/server/rpc-handler";

const preconnectPromise = preconnectToDbAndRedis();

const app = next({
  dev: env.ENV === "development",
  turbopack: true,
  customServer: true,
  conf: nextConfig,
});
await app.prepare();
const upgradeHandler = app.getUpgradeHandler();
const requestHandler = app.getRequestHandler();

await preconnectPromise;

// Required globals for translating Bun API to Node
const EMPTY_BUFFER = Buffer.alloc(0);
const INTERNAL_SOCKET_DATA = Symbol.for("::bunternal::");

/**
 * Handles Next.js routes
 */
const handleNext = async (request: Request) => {
  const { req, res } = toReqRes(request);

  // Check if it's a ws upgrade request
  if (request.headers.get("Connection") === "Upgrade") {
    void upgradeHandler(req, req.socket, EMPTY_BUFFER);
    return;
  }

  // Render the page
  void requestHandler(req, res);

  return toFetchResponse(res);
};

// Start the server
const server = Bun.serve({
  port: Number(process.env.PORT ?? "3001"),
  hostname: process.env.HOSTNAME ?? "0.0.0.0",
  development: process.env.NODE_ENV !== "production",

  reusePort: true,

  async fetch(req, _server) {
    // Handle oRPC routes first
    const response = await handleRPC(req);
    if (response) return response;

    // Fall back to Next.js for all other routes
    const nextResponse = await handleNext(req);
    if (nextResponse) return nextResponse;

    return new Response("Not found", { status: 404 });
  },
});

function printDevServerInfo() {
  const protocol = server.url.protocol;
  const port = server.port;

  console.log(`Environment: ${process.env.NODE_ENV ?? "development"}`);
  console.log();
  console.log(`  Local:    ${protocol}//localhost:${port}/`);
  console.log(`  API Ref:  ${protocol}//localhost:${port}/api-reference`);

  const networkIps = [];
  const interfaces = networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const addrs = interfaces[name];
    if (addrs) {
      for (const addr of addrs) {
        if (addr.family === "IPv4" && !addr.internal) {
          networkIps.push(addr.address);
        }
      }
    }
  }

  for (const ip of networkIps) {
    console.log(`  Network:  ${protocol}//${ip}:${port}/`);
  }

  console.log();
}

if (env.ENV !== "production") {
  printDevServerInfo();
}

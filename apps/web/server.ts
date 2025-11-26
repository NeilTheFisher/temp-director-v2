// polyfill for CompressionStream https://github.com/oven-sh/bun/issues/1723
import "@ungap/compression-stream/poly";

import http, { type IncomingMessage, type ServerResponse } from "node:http";
import { networkInterfaces } from "node:os";
import { env } from "@director_v2/config";
import { preconnectToDbAndRedis } from "@director_v2/db";
import next from "next";
import { handleRPC } from "@/server/rpc-handler";
import nextConfig from "./next.config";

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

const EMPTY_BUFFER = Buffer.alloc(0);

const handleNext = async (req: IncomingMessage, res: ServerResponse) => {
  // Check if it's a ws upgrade request
  if (req.headers.connection === "Upgrade") {
    await upgradeHandler(req, req.socket, EMPTY_BUFFER);
    return;
  }

  await requestHandler(req, res);
};

const server = http.createServer(async (req, res) => {
  const matched = await handleRPC(req, res);

  if (!matched) {
    await handleNext(req, res);
  }
});

const port = Number(process.env.PORT) || 3001;
server.listen(port, "0.0.0.0", () => {
  if (env.ENV !== "production") {
    printDevServerInfo();
  }
});

function printDevServerInfo() {
  const protocol = "http:";

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

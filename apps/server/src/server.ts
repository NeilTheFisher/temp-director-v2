// polyfill for CompressionStream https://github.com/oven-sh/bun/issues/1723
import "@ungap/compression-stream/poly";
// Initialize Sentry
import "./sentry.server.config";

import { networkInterfaces } from "node:os";

import { env } from "@director_v2/config";

import { handleRPC } from "./rpc-handler";

const port = Number(process.env.PORT) || 3001;

Bun.serve({
  port: port,
  fetch: async (req) => {
    const response = await handleRPC(req);

    if (response) {
      return response;
    }

    return new Response("Not Found", { status: 404 });
  },
  development: env.ENV !== "production",
  tls: {
    key: Bun.file("./certificates/localhost-key.pem"),
    cert: Bun.file("./certificates/localhost.pem"),
  },
});

if (env.ENV !== "production") {
  printDevServerInfo();
}

function printDevServerInfo() {
  const protocol = "https:";

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

// polyfill for CompressionStream https://github.com/oven-sh/bun/issues/1723
import "@ungap/compression-stream/poly";

// Initialize Sentry
import "./sentry.server.config";

import * as fs from "node:fs";
import * as http2 from "node:http2";
import { networkInterfaces } from "node:os";
import { env } from "@director_v2/config";
// import proxy from "http2-proxy";
import { handleRPC } from "./rpc-handler";

const server = http2.createSecureServer(
  {
    key: fs.readFileSync("./certificates/localhost-key.pem"),
    cert: fs.readFileSync("./certificates/localhost.pem"),
    allowHTTP1: true,
  },
  async (req, res) => {
    const matched = await handleRPC(req, res);

    if (!matched) {
      // forward to web server
      // await proxy.web(req, res, {
      //   protocol: "https",
      //   hostname: "localhost",
      //   port: webPort,
      //   onReq: async (r) => {
      //     r.headers["x-forwarded-for"] = r.socket.remoteAddress;
      //     r.headers["x-forwarded-host"] = r.headers.host;
      //   },
      // });
      // return;
    }

    res.statusCode = 404;
    res.end();
  },
);

const port = Number(process.env.PORT) || 3001;
server.listen(
  {
    port,
    host: "0.0.0.0",
    reusePort: true,
  },
  () => {
    if (env.ENV !== "production") {
      printDevServerInfo();
    }
  },
);

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

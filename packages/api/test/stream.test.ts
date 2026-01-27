import { appRouter } from "@director_v2/api";
import { env } from "@director_v2/env/server";
import { call } from "@orpc/server";
import { beforeAll, describe, expect, it } from "vitest";

import { getAuthToken } from "./utils";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Basic test to validate that the OpenAPI HTTP route matches the RPC procedure output
describe("Stream OpenAPI vs RPC parity", () => {
  let authToken: string;

  beforeAll(async () => {
    authToken = await getAuthToken();
  });

  it("returns same stream URLs from GET /api/getStreamUrls/:streamUrlId and RPC stream.getStreamUrls", async () => {
    // TODO: Replace with actual stream URL ID from your test database
    // For now, skip if no test stream URL ID is available
    const testStreamUrlId = process.env.TEST_STREAM_URL_ID;

    if (!testStreamUrlId) {
      console.warn("No TEST_STREAM_URL_ID env var set, skipping stream URL test");
      return;
    }

    const apiResponse = await fetch(
      new URL(`/api/getStreamUrls/${testStreamUrlId}`, env.DIRECTOR_URL),
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    const apiJson = await apiResponse.json();

    const rpcResponse = await call(
      appRouter.stream.getStreamUrls,
      { streamUrlId: testStreamUrlId },
      {
        context: {
          session: {
            user: { id: "1" },
          },
          clientIp: "192.168.0.1",
          req: undefined,
        },
      }
    );

    expect(rpcResponse).toEqual(apiJson);
  });
});

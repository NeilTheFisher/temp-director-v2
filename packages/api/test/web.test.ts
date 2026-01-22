import { appRouter } from "@director_v2/api";
import { env } from "@director_v2/env/server";
import { call } from "@orpc/server";
import { describe, expect, it } from "vitest";

import { deleteProps } from "./utils";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Basic test to validate that the OpenAPI HTTP route matches the RPC procedure output
describe("Web Events OpenAPI vs RPC parity", () => {
  it("returns same event data from GET /web/api/eventsList and RPC events.webEventsList", async () => {
    const apiResponse = await fetch(new URL("/web/api/eventsList", env.DIRECTOR_URL));
    const apiJson = await apiResponse.json();

    const rpcResponse = await call(
      appRouter.web.webEventsList,
      {},
      {
        context: {
          session: null,
          clientIp: "192.168.0.1",
        },
      }
    );

    // Delete properties that differ between API and RPC responses
    const propsToDelete = [
      "appUrl",
      "event_url",
      "invitation_message",
      "map_image_url",
      "external", // PHP serializes empty arrays as [], JS as {}
      "onLocation",
      "onLocationLock",
      "invitation_accepted",
    ];
    const cleanApiJson = deleteProps(apiJson, propsToDelete);
    const cleanRpcResponse = deleteProps(rpcResponse, propsToDelete);

    expect(cleanRpcResponse).toEqual(cleanApiJson);
  });
});

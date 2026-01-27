import { appRouter } from "@director_v2/api";
import { env } from "@director_v2/env/server";
import { call } from "@orpc/server";
import { beforeAll, describe, expect, it } from "vitest";

import { deleteProps, getAuthToken } from "./utils";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Basic test to validate that the OpenAPI HTTP route matches the RPC procedure output
describe("Events OpenAPI vs RPC parity", () => {
  let authToken: string;

  beforeAll(async () => {
    authToken = await getAuthToken();
  });

  it("returns same event data from GET /api/events and RPC events.listEvents", async () => {
    const apiResponse1 = await fetch(
      new URL("/validatePhoneNumber/+15145550081", env.DIRECTOR_URL),
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    const apiJson1 = await apiResponse1.json();
    console.log("apiJson1!!!", apiJson1);

    const apiResponse = await fetch(new URL("/api/events", env.DIRECTOR_URL), {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    const apiJson = await apiResponse.json();

    const rpcResponse = await call(
      appRouter.events.listEvents,
      {},
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

    // Delete properties that differ between API and RPC responses
    const propsToDelete = ["appUrl", "event_url", "invitation_message", "map_image_url"];
    const cleanApiJson = deleteProps(apiJson, propsToDelete);
    const cleanRpcResponse = deleteProps(rpcResponse, propsToDelete);

    expect(cleanRpcResponse).toEqual(cleanApiJson);
  });

  it("returns same categories data from GET /api/events/categories and RPC events.categories", async () => {
    const apiResponse = await fetch(new URL("/api/events/categories", env.DIRECTOR_URL), {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    const apiJson = await apiResponse.json();

    const rpcResponse = await call(appRouter.events.categories, undefined, {
      context: {
        session: {
          user: { id: "1" },
        },
        clientIp: "192.168.0.1",
        req: undefined,
      },
    });

    expect(rpcResponse).toEqual(apiJson);
  });
});

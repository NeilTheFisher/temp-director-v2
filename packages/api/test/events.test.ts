import { appRouter } from "@director_v2/api";
import { env } from "@director_v2/config";
import { call } from "@orpc/server";
import { beforeAll, describe, expect, it } from "vitest";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Basic test to validate that the OpenAPI HTTP route matches the RPC procedure output
describe("Events OpenAPI vs RPC parity", () => {
  let authToken: string;

  beforeAll(async () => {
    const res = await fetch(new URL("/device/login", env.DIRECTOR_URL), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: env.DIRECTOR_TEST_USER_EMAIL,
        password: env.DIRECTOR_TEST_USER_PASSWORD,
      }),
    });

    const data = (await res.json()) as { response: { access_token: string } };

    // console.log("Login response:", data);

    authToken = data.response.access_token;
  });

  it("returns same event data from GET /api/events and RPC events.listEvents", async () => {
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
        },
      },
    );

    // Delete properties that differ between API and RPC responses
    const deleteProps = (obj: unknown): unknown => {
      if (Array.isArray(obj)) {
        return obj.map(deleteProps);
      }
      if (obj !== null && typeof obj === "object") {
        const copy = { ...obj };
        delete (copy as Record<string, unknown>).appUrl;
        delete (copy as Record<string, unknown>).event_url;
        delete (copy as Record<string, unknown>).invitation_message;
        delete (copy as Record<string, unknown>).map_image_url;
        for (const key in copy) {
          (copy as Record<string, unknown>)[key] = deleteProps(
            (copy as Record<string, unknown>)[key],
          );
        }
        return copy;
      }
      return obj;
    };

    const cleanApiJson = deleteProps(apiJson);
    const cleanRpcResponse = deleteProps(rpcResponse);

    expect(cleanApiJson).toEqual(cleanRpcResponse);
  });
});

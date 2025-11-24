import { appRouter } from "@director_v2/api";
import { env } from "@director_v2/config";
import { call } from "@orpc/server";
import { beforeAll, describe, expect, it } from "vitest";
import { deleteProps, getAuthToken } from "./utils";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Basic test to validate that the OpenAPI HTTP route matches the RPC procedure output
describe("User OpenAPI vs RPC parity", () => {
  let authToken: string;

  beforeAll(async () => {
    authToken = await getAuthToken();
  });

  it("returns same user data from GET /api/getUserInfo and RPC user.getUserInfo", async () => {
    const apiResponse = await fetch(
      new URL("/api/getUserInfo", env.DIRECTOR_URL),
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );
    const apiJson = await apiResponse.json();

    const rpcResponse = await call(appRouter.user.getUserInfo, undefined, {
      context: {
        session: {
          user: { id: "1" },
        },
        clientIp: "192.168.0.1",
      },
    });

    const propsToDelete = [
      "avatar",
      "image_uid",
      "organizations",
      "super_admin",
    ];
    const cleanApiJson = deleteProps(apiJson, propsToDelete);
    const cleanRpcResponse = deleteProps(rpcResponse, propsToDelete);

    expect(cleanRpcResponse).toEqual(cleanApiJson);
  });

  // getUserInfoByMsisdn - no direct PHP endpoint, test RPC only
  it("getUserInfoByMsisdn returns valid user info", async () => {
    const testMsisdn = "15145550081";

    const rpcResponse = await call(
      appRouter.user.getUserInfoByMsisdn,
      { msisdn: testMsisdn },
      {
        context: {
          session: {
            user: { id: "1" },
          },
          clientIp: "192.168.0.1",
        },
      },
    );

    // Verify structure
    expect(rpcResponse).toHaveProperty("id");
    expect(rpcResponse).toHaveProperty("name");
    expect(rpcResponse).toHaveProperty("avatar");
    expect(rpcResponse).toHaveProperty("sip");
  });
});

import { appRouter } from "@director_v2/api";
import { env } from "@director_v2/config";
import { call } from "@orpc/server";
import { describe, expect, it } from "vitest";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Basic test to validate that the OpenAPI HTTP route matches the RPC procedure output
describe("Odience OpenAPI vs RPC parity", () => {
  it("returns same category list from GET /mobile/categoryList and RPC odience.getCategoryList", async () => {
    const apiResponse = await fetch(new URL("/mobile/categoryList", env.DIRECTOR_URL));
    const apiJson = await apiResponse.json();

    const rpcResponse = await call(appRouter.odience.getCategoryList, undefined, {
      context: {
        session: null,
        clientIp: "192.168.0.1",
      },
    });

    expect(apiJson).toEqual(rpcResponse);
  });

  it("returns same validation result from GET /validatePhoneNumber/:msisdn/:country_code and RPC odience.validatePhoneNumber", async () => {
    const testMsisdn = "15145550081";
    const testCountryCode = "CA";

    const apiResponse = await fetch(
      new URL(`/validatePhoneNumber/${testMsisdn}/${testCountryCode}`, env.DIRECTOR_URL)
    );
    const apiJson = await apiResponse.json();

    const rpcResponse = await call(
      appRouter.odience.validatePhoneNumber,
      { msisdn: testMsisdn, country_code: testCountryCode },
      {
        context: {
          session: null,
          clientIp: "192.168.0.1",
        },
      }
    );

    expect(rpcResponse).toEqual(apiJson);
  });
});

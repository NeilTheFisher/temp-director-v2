import { ORPCError } from "@orpc/server";
import { toReqRes } from "fetch-to-node";
import OAuth2Server from "oauth2-server";

import { OAuthModel } from "../lib/oauth/OAuthModel";
import { pub } from "../orpc";

const oauthModel = new OAuthModel();

export const oauthRouter = pub.oauth.router({
  token: pub.oauth.token.handler(async ({ input, context }) => {
    if (!context.req) {
      throw new ORPCError("BAD_REQUEST", { message: "Request is required" });
    }

    try {
      const { res } = toReqRes(context.req);

      // Parse query parameters from URL
      const url = new URL(context.req.url);
      const queryParams: Record<string, string> = {};
      url.searchParams.forEach((value, key) => {
        queryParams[key] = value;
      });

      // Construct OAuth2Server request with all required properties
      const request = new OAuth2Server.Request({
        headers: Object.fromEntries(context.req.headers.entries()),
        method: context.req.method,
        query: queryParams,
        body: input.body,
      });

      const response = new OAuth2Server.Response(res);

      const oauthServer = new OAuth2Server({
        model: oauthModel,
        accessTokenLifetime: 60 * 60 * 24 * 365, // 1 year
        refreshTokenLifetime: 60 * 60 * 24 * 365, // 1 year
      });

      const token = await oauthServer.token(request, response);

      // Format response to match Laravel Passport format
      return {
        token_type: "Bearer" as const,
        expires_in: token.accessTokenExpiresAt
          ? Math.floor((token.accessTokenExpiresAt.getTime() - Date.now()) / 1000)
          : 0,
        access_token: token.accessToken,
        refresh_token: token.refreshToken,
      };
    } catch (error: unknown) {
      const err = error as any;
      console.error("OAuth token error:", err.message);

      // Map OAuth2 errors to appropriate HTTP status codes
      if (err.name === "invalid_client" || err.message?.includes("client")) {
        throw new ORPCError("UNAUTHORIZED", {
          message: "Invalid client credentials",
        });
      }

      if (err.name === "invalid_grant" || err.message?.includes("grant")) {
        throw new ORPCError("BAD_REQUEST", {
          message: err.message || "Invalid grant",
        });
      }

      if (err.name === "invalid_request") {
        throw new ORPCError("BAD_REQUEST", {
          message: err.message || "Invalid request",
        });
      }

      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: err.message || "An error occurred while issuing the token",
      });
    }
  }),
});

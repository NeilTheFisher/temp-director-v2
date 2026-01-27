import z from "zod";

import { base } from "./base";

const tokenRequestSchema =
  z.any() ||
  // TODO
  z.object({
    grant_type: z.enum(["password", "refresh_token"]),
    client_id: z.string(),
    client_secret: z.string().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
    refresh_token: z.string().optional(),
    scope: z.string().optional(),
  });

const tokenResponseSchema = z.object({
  token_type: z.literal("Bearer"),
  expires_in: z.number(),
  access_token: z.string(),
  refresh_token: z.string().optional(),
});

const errorResponseSchema = z.object({
  error: z.string(),
  error_description: z.string(),
});

export const oauthContract = base.prefix("/oauth").router({
  token: base
    .route({
      path: "/token",
      method: "POST",
      inputStructure: "detailed",
      spec: {
        // example, schema could be changed later.
        requestBody: {
          content: {
            "application/x-www-form-urlencoded": {
              examples: {
                password_grant: {
                  summary: "Password Grant",
                  value: {
                    grant_type: "password",
                    client_id: "your_client_id",
                    client_secret: "your_client_secret",
                    username: "user@example.com",
                    password: "your_password",
                    scope: "read write",
                  },
                },
                refresh_token_grant: {
                  summary: "Refresh Token Grant",
                  value: {
                    grant_type: "refresh_token",
                    client_id: "your_client_id",
                    client_secret: "your_client_secret",
                    refresh_token: "your_refresh_token",
                  },
                },
              },
            },
          },
        },
      },
    })
    .input(tokenRequestSchema)
    .output(z.union([tokenResponseSchema, errorResponseSchema])),
});

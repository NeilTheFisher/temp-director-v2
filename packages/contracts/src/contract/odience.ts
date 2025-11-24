import { z } from "zod";
import { base } from "./base";

export const odienceContract = {
  provisionUser: base
    .route({
      path: "/odience",
    })
    .input(
      z.object({
        msisdn: z.string(),
        country_code: z.string().optional(),
      }),
    )
    .output(
      z.object({
        code: z.number(),
        message: z.string(),
      }),
    ),
  validatePhoneNumber: base
    .route({
      path: "/odience/validate/{msisdn}",
    })
    .input(
      z.object({
        msisdn: z.string(),
        country_code: z.string().optional(),
      }),
    )
    .output(
      z.object({
        msisdn: z.string(),
        valid: z.boolean(),
        formatted: z.string(),
        country_code: z.string(),
        error: z.string().optional().default(""),
        code: z.number(),
      }),
    ),
  getCategoryList: base
    .route({
      path: "/odience/categories",
    })
    .input(z.void())
    .output(z.record(z.string(), z.string())),
};

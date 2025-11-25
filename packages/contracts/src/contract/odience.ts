import { z } from "zod";
import { base } from "./base";

export const odienceContract = base.prefix("/").router({
  provisionUser: base
    .route({
      path: "/odience",
      method: "GET",
    })
    .input(z.object({ msisdn: z.string() }))
    .output(
      z.object({
        code: z.number(),
        message: z.string(),
      }),
    ),
  validatePhoneNumber: base
    .route({
      path: "/validatePhoneNumber/{msisdn}",
      method: "GET",
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
      path: "/mobile/categoryList",
      method: "GET",
    })
    .input(z.unknown())
    .output(z.record(z.string(), z.string())),
});

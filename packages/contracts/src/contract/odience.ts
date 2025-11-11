import { z } from "zod";
import { base } from "./base";

export const odienceContract = {
  provisionUser: base
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
    .input(
      z.object({
        msisdn: z.string(),
        country_code: z.string().optional(),
      }),
    )
    .output(
      z.object({
        valid: z.boolean(),
        formatted: z.string(),
        country_code: z.string(),
        error: z.string().optional(),
        code: z.number(),
      }),
    ),
  getCategoryList: base.output(z.record(z.string(), z.string())),
};

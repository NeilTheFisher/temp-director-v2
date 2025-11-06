import { oc } from "@orpc/contract";
import { z } from "zod";

export const odienceContract = {
  provisionUser: oc
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
  validatePhoneNumber: oc
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
  getCategoryList: oc.output(z.record(z.string(), z.string())),
};

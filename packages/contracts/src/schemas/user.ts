import { z } from "zod";

export const GetUserInfoInputSchema = z.object({});

export const GetUserInfoByMsisdnInputSchema = z.object({
  msisdn: z.string(),
});

import { z } from "zod";

export const UserInfoSchema = z.object({
  id: z.number(),
  msisdn: z.string(),
  email: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const GetUserInfoInputSchema = z.object({});

export const GetUserInfoByMsisdnInputSchema = z.object({
  msisdn: z.string(),
});

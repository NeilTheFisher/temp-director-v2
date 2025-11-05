import { UserSchema } from "@director_v2/db";
import { z } from "zod";

export const UserInfoSchema = UserSchema.pick({
  id: true,
  msisdn: true,
  email: true,
  name: true,
});

export const GetUserInfoInputSchema = z.object({});

export const GetUserInfoByMsisdnInputSchema = z.object({
  msisdn: z.string(),
});

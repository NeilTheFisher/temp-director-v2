import { userSchema } from "@director_v2/db/prisma/generated/zod/schemas/models/user.schema";
import z from "zod";
import { base } from "./base";

const minUserSchema = userSchema.pick({
  id: true,
  msisdn: true,
  email: true,
  name: true,
});

export const userContract = {
  getUserInfo: base.input(z.object({})).output(minUserSchema),
  getUserInfoByMsisdn: base
    .input(
      z.object({
        msisdn: z.string(),
      }),
    )
    .output(minUserSchema),
};

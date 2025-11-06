import { userSchema } from "@director_v2/db/prisma/generated/zod/schemas/models/user.schema";
import { oc } from "@orpc/contract";
import z from "zod";

const minUserSchema = userSchema.pick({
  id: true,
  msisdn: true,
  email: true,
  name: true,
});

export const userContract = {
  getUserInfo: oc.input(z.object({})).output(minUserSchema),
  getUserInfoByMsisdn: oc
    .input(
      z.object({
        msisdn: z.string(),
      }),
    )
    .output(minUserSchema),
};

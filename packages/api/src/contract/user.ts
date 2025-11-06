import { userSchema } from "@director_v2/db/prisma/generated/zod/schemas/models/user.schema";
import { oc } from "@orpc/contract";
import {
  GetUserInfoByMsisdnInputSchema,
  GetUserInfoInputSchema,
} from "../schemas/user";

const minUserSchema = userSchema.pick({
  id: true,
  msisdn: true,
  email: true,
  name: true,
});

export const userContract = {
  getUserInfo: oc.input(GetUserInfoInputSchema).output(minUserSchema),
  getUserInfoByMsisdn: oc
    .input(GetUserInfoByMsisdnInputSchema)
    .output(minUserSchema),
};

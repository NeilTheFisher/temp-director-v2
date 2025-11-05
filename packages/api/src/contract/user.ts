import { oc } from "@orpc/contract";
import {
  GetUserInfoByMsisdnInputSchema,
  GetUserInfoInputSchema,
  UserInfoSchema,
} from "../schemas/user";

export const userContract = {
  getUserInfo: oc.input(GetUserInfoInputSchema).output(UserInfoSchema),
  getUserInfoByMsisdn: oc
    .input(GetUserInfoByMsisdnInputSchema)
    .output(UserInfoSchema),
};

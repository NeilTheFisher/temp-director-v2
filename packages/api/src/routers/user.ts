import { ORPCError } from "@orpc/server";
import * as userRepository from "../lib/repositories/user";
import { authed } from "../orpc";

export const userRouter = {
  getUserInfo: authed.user.getUserInfo.handler(async ({ context }) => {
    console.log("UserController.getUserInfo:");

    if (!context.session?.user) {
      throw new ORPCError("UNAUTHORIZED", {
        message: "User not found or not authenticated",
      });
    }

    const userId = Number(context.session.user.id);
    console.log("User ID:", userId);

    const userInfo = await userRepository.getFullUserInfo(userId);

    if (!userInfo) {
      throw new ORPCError("UNAUTHORIZED", {
        message: "User not found or not authenticated",
      });
    }

    return userInfo;
  }),

  getUserInfoByMsisdn: authed.user.getUserInfoByMsisdn.handler(
    async ({ input, context }) => {
      const { msisdn } = input;
      console.log(`UserController.getUserInfoByMsisdn: ${msisdn}`);

      if (!context.session?.user) {
        throw new ORPCError("UNAUTHORIZED", {
          message: "Unauthorized",
        });
      }

      try {
        const userInfo = await userRepository.getUserInfoByMsisdn(msisdn);

        if (!userInfo) {
          throw new ORPCError("UNAUTHORIZED", {
            message: "User not found or not authenticated",
          });
        }

        return userInfo;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: `UserController.getUserInfoByMsisdn: failed with error: ${errorMessage}`,
        });
      }
    },
  ),
};

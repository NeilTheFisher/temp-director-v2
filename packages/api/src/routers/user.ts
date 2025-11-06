import { ORPCError } from "@orpc/server";
import { authed } from "../orpc";

// TODO: Import your actual services when they're available
// import { UserService } from "../services/UserService";

// const userService = new UserService();

export const userRouter = {
  getUserInfo: authed.user.getUserInfo.handler(async ({ context }) => {
    console.log("UserController.getUserInfo:");

    if (!context.session?.user) {
      throw new ORPCError("UNAUTHORIZED", {
        message: "User not found or not authenticated",
      });
    }

    const userId = context.session.user.id;
    console.log("User ID:", userId);

    // TODO: Replace with actual service calls
    // const userInfo = await userService.getUserInfo(parseInt(userId));
    //
    // if (!userInfo) {
    //   throw new ORPCError("UNAUTHORIZED", {
    //     message: "User not found or not authenticated"
    //   });
    // }
    //
    // return userInfo;

    // Temporary placeholder
    return {
      id: BigInt(userId),
      msisdn: null,
      email: null,
      name: null,
    };
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
        // TODO: Replace with actual service calls
        // const userInfo = await userService.getUserInfoByMsisdn(msisdn);
        //
        // if (!userInfo) {
        //   throw new ORPCError("UNAUTHORIZED", {
        //     message: "User not found or not authenticated"
        //   });
        // }
        //
        // return userInfo;

        // Temporary placeholder
        return {
          id: BigInt(1),
          msisdn: msisdn || null,
          email: `${msisdn}@example.com`,
          name: "John Doe",
        };
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

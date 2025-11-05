import { ORPCError } from "@orpc/server";
import * as eventRepository from "../lib/repositories/event";
import * as userRepository from "../lib/user-handlers";
import { authed } from "../orpc";

export const eventRouter = {
  listEvents: authed.events.listEvents.handler(async ({ context }) => {
    console.log("EventController.list:");

    if (!context.session?.user) {
      throw new ORPCError("UNAUTHORIZED", {
        message: "User not found or not authenticated",
      });
    }

    const userId = BigInt(context.session.user.id);
    const userInfo = await userRepository.getUserInfoForEvents(userId);

    const events = await eventRepository.getVisibleEvents(
      userInfo.userId,
      userInfo.orgIds,
      userInfo.msisdn,
      userInfo.emails,
      userInfo.isSuperAdmin
    );

    return events;
  }),

  listPartialEvents: authed.events.listPartialEvents.handler(
    async ({ context }) => {
      console.log("EventController.listPartial:");

      if (!context.session?.user) {
        throw new ORPCError("UNAUTHORIZED", {
          message: "User not found or not authenticated",
        });
      }

      const userId = BigInt(context.session.user.id);
      const userInfo = await userRepository.getUserInfoForEvents(userId);

      const events = await eventRepository.getVisibleEvents(
        userInfo.userId,
        userInfo.orgIds,
        userInfo.msisdn,
        userInfo.emails,
        userInfo.isSuperAdmin
      );

      return events;
    }
  ),
};

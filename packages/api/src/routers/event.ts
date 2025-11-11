import { ORPCError } from "@orpc/server";
import * as eventRepository from "../lib/repositories/event";
import * as userRepository from "../lib/user-handlers";
import { authed, pub } from "../orpc";

export const eventRouter = pub.events.router({
  listEvents: authed.events.listEvents.handler(async ({ context }) => {
    console.log("EventController.list:");

    // Extract user ID from authenticated session
    const userId = Number(context.session.user.id);

    // Get user info for event filtering (roles, orgs, contacts)
    const userInfo = await userRepository.getUserInfoForEvents(userId);

    if (!userInfo) {
      throw new Error("User not found or not authenticated");
    }

    // Fetch all events visible to this user based on permissions
    const events = await eventRepository.getVisibleEvents(
      userInfo.userId,
      userInfo.orgIds,
      userInfo.msisdn,
      userInfo.emails,
      userInfo.isSuperAdmin,
    );

    return events as any;
  }),

  // biome-ignore lint/correctness/useYield: <explanation>
  listEventsLive: authed.events.listEventsLive.handler(async function* ({
    context,
  }) {
    console.log("EventController.listLive:");

    // TODO

    throw new ORPCError("NOT_IMPLEMENTED");
  }),

  listPartialEvents: authed.events.listPartialEvents.handler(
    async ({ context }) => {
      console.log("EventController.listPartial:");

      // Extract user ID from authenticated session
      const userId = Number(context.session.user.id);

      // Get user info for event filtering (roles, orgs, contacts)
      const userInfo = await userRepository.getUserInfoForEvents(userId);

      if (!userInfo) {
        throw new Error("User not found or not authenticated");
      }

      // Fetch all events visible to this user based on permissions
      const events = await eventRepository.getVisibleEvents(
        userInfo.userId,
        userInfo.orgIds,
        userInfo.msisdn,
        userInfo.emails,
        userInfo.isSuperAdmin,
      );

      return events as any;
    },
  ),
});

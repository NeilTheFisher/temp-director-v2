import * as eventRepository from "../lib/repositories/event";
import * as userRepository from "../lib/user-handlers";
import { authed } from "../orpc";

export const eventRouter = {
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

    return events;
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

      return events;
    },
  ),
};

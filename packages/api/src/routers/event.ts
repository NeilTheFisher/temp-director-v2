import * as eventRepository from "../lib/repositories/event";
import * as userRepository from "../lib/user-handlers";
import { authed, pub } from "../orpc";

export const eventRouter = {
  listEvents: pub.events.listEvents.handler(async ({ context }) => {
    console.log("EventController.list:");

    // const userId = BigInt(context.session.user.id);
    const userId = 1;
    const userInfo = await userRepository.getUserInfoForEvents(userId);

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

      const userId = context.session.user.id;
      const userInfo = await userRepository.getUserInfoForEvents(userId);

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

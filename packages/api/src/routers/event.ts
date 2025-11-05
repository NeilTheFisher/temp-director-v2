import { ORPCError } from "@orpc/server";
import { authed } from "../orpc";

export const eventRouter = {
  listEvents: authed.events.listEvents.handler(async ({ context }) => {
    console.log("EventController.list:");

    if (!context.session?.user) {
      throw new ORPCError("UNAUTHORIZED", {
        message: "User not found or not authenticated",
      });
    }

    // TODO: Replace with actual service calls
    // const userId = context.session.user.id;
    // const userInfo = await userService.getUserInfoForEvent(parseInt(userId));
    //
    // if (!userInfo) {
    //   throw new ORPCError("UNAUTHORIZED", {
    //     message: "User not found or not authenticated"
    //   });
    // }
    //
    // const events = await eventService.getEvents(userInfo);
    // return events;

    // Temporary placeholder
    return [
      {
        id: 1,
        name: "Sample Event",
        description: "This is a sample event",
        status: "upcoming",
      },
    ];
  }),

  listPartialEvents: authed.events.listPartialEvents.handler(
    async ({ context }) => {
      console.log("EventController.listPartial:");

      if (!context.session?.user) {
        throw new ORPCError("UNAUTHORIZED", {
          message: "User not found or not authenticated",
        });
      }

      // TODO: Replace with actual service calls
      // Same implementation as listEvents for now
      // const userId = context.session.user.id;
      // const userInfo = await userService.getUserInfoForEvent(parseInt(userId));
      //
      // if (!userInfo) {
      //   throw new ORPCError("UNAUTHORIZED", {
      //     message: "User not found or not authenticated"
      //   });
      // }
      //
      // const events = await eventService.getEvents(userInfo);
      // return events;

      // Temporary placeholder
      return [
        {
          id: 1,
          name: "Sample Partial Event",
          description: "This is a sample partial event",
          status: "upcoming",
        },
      ];
    }
  ),
};

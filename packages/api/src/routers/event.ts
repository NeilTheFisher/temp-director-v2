import { ORPCError } from "@orpc/server";
import * as eventRepository from "../lib/repositories/events";
import * as userRepository from "../lib/user-handlers";
import { authed, pub } from "../orpc";

export const eventRouter = pub.events.router({
  listEvents: authed.events.listEvents.handler(async ({ input, context }) => {
    console.log("EventController.list:");

    // Extract user ID from authenticated session
    const userId = Number(context.session.user.id);

    // Get user info for event filtering (roles, orgs, contacts)
    const userInfo = await userRepository.getUserInfoForEvents(userId);

    if (!userInfo) {
      throw new ORPCError("UNAUTHORIZED", {
        message: "User not found or not authenticated",
      });
    }

    // Fetch all events visible to this user based on permissions
    const result = await eventRepository.getVisibleEvents(userInfo, {
      category: input.category,
      date: input.date,
      location: input.location,
      per_page: input.per_page,
      current_page: input.current_page,
      isPartial: false,
      isWeb: false,
      clientIp: context.clientIp,
    });

    return result;
  }),

  listEventsLive: authed.events.listEventsLive.handler(async function* () {
    console.log("EventController.listLive:");

    // TODO - implement streaming events
    // Yield dummy event first, then throw to satisfy generator requirement and indicate not implemented
    yield {
      id: BigInt(0),
      name: "",
      location: null,
      location_info: null,
      owner_id: 0,
      duration: null,
      date: null,
      active: true,
      capacity: null,
      description: null,
      category: null,
      is_public: true,
      profanity: true,
      is_5g: null,
      created_at: 0,
      updated_at: 0,
      latitude: null,
      longitude: null,
      image_uid: null,
      promo_video_url: null,
      invitations_only: true,
      is_draft: false,
      payed: false,
      image_url: null,
      brand_image_url: null,
      brand_background_image_url: null,
      brand_ad_image_url: null,
      featured: null,
      hashtags: null,
      app_allowed: true,
      web_allowed: false,
      hmd_allowed: false,
      shop_bot_id: "",
      promo_video_aspect_ratio: null,
      promo_video_status: null,
      restream: false,
      short_description: null,
      featured_date: null,
      featured_artist: null,
      web_image_url: null,
      group_id: BigInt(0),
    };

    throw new ORPCError("NOT_IMPLEMENTED", {
      message: "Live events streaming not yet implemented",
    });
  }),

  listPartialEvents: authed.events.listPartialEvents.handler(
    async ({ input, context }) => {
      console.log("EventController.listPartial:");

      // Extract user ID from authenticated session
      const userId = Number(context.session.user.id);

      // Get user info for event filtering (roles, orgs, contacts)
      const userInfo = await userRepository.getUserInfoForEvents(userId);

      if (!userInfo) {
        throw new ORPCError("UNAUTHORIZED", {
          message: "User not found or not authenticated",
        });
      }

      // Fetch all events visible to this user based on permissions
      const result = await eventRepository.getVisibleEvents(userInfo, {
        category: input.category,
        date: input.date,
        location: input.location,
        per_page: input.per_page,
        current_page: input.current_page,
        isPartial: true,
        isWeb: false,
        clientIp: context.clientIp,
      });

      return result as never;
    },
  ),
});

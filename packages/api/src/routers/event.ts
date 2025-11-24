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

  get: authed.events.get.handler(async ({ input }) => {
    console.log("EventController.get:", input.id);

    throw new ORPCError("NOT_IMPLEMENTED");
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

  webEventsList: pub.events.webEventsList.handler(
    async ({ input, context }) => {
      console.log("EventController.webEventsList:");

      // Use anonymous user for web events
      const anonymousUserInfo = {
        userId: 0,
        msisdn: "",
        isSuperAdmin: false,
        emails: [],
        orgIds: [],
      };

      // Fetch all public web events
      const result = await eventRepository.getVisibleEvents(anonymousUserInfo, {
        category: input.category,
        date: input.date,
        location: input.location,
        per_page: input.per_page,
        current_page: input.current_page,
        isPartial: false,
        isWeb: true,
        clientIp: context.clientIp,
      });

      // Filter fields to match legacy API WebEventResource
      const events = result.events.map((event) => {
        // Helper to handle description
        const description = event.description || null;

        // Helper to handle coordinates
        const coordinates =
          event.coordinates &&
          event.coordinates.lat === 0 &&
          event.coordinates.lng === 0
            ? null
            : event.coordinates;

        return {
          id: event.id,
          // owner_id: event.owner_id, // Omitted
          organization_id: event.organization_id,
          organization: event.organization,
          name: event.name,
          description: description,
          category: event.category,
          // location: event.location, // Omitted
          ...(coordinates ? { coordinates } : {}),
          date: event.date,
          featured: event.featured,
          // duration: event.duration, // Omitted
          label: event.label,
          capacity: event.capacity,
          // is_public: event.is_public, // Omitted
          is_5g: event.is_5g,
          imageUrl: event.imageUrl,
          // organization_image_url: event.organization_image_url, // Omitted
          map_image_url: event.map_image_url,
          // promo_video_url: event.promo_video_url, // Omitted
          // promo_video_aspect_ratio: event.promo_video_aspect_ratio, // Omitted
          // has_ricoh_stream: event.has_ricoh_stream, // Omitted
          // payed: event.payed, // Omitted
          // ticket_platform: event.ticket_platform, // Omitted
          // ticket_url: event.ticket_url, // Omitted
          // min_price: event.min_price, // Omitted
          invitation_message: event.invitation_message,
          // invitations_only: event.invitations_only, // Omitted
          // categoryImage: event.categoryImage, // Omitted
          web_allowed: event.web_allowed,
          app_allowed: event.app_allowed,
          // TODO: PHP returns false for these in tests, but data suggests true.
          // We are using the actual data here.
          invitation_accepted: event.invitation_accepted,
          // invitation_requested: event.invitation_requested, // Omitted
          appUrl: event.appUrl,
          event_url: event.event_url,
          sponsors: event.sponsors,
          host: event.host,
          // TODO: PHP returns false for these in tests, but data suggests true.
          // We are using the actual data here.
          onLocation: event.onLocation,
          onLocationLock: event.onLocationLock,
        };
      });

      // Return events wrapped in data object to match Laravel ResourceCollection
      return { data: events };
    },
  ),

  categories: authed.events.categories.handler(async ({ context }) => {
    console.log("EventController.categories:");

    // Extract user ID from authenticated session
    const userId = Number(context.session.user.id);

    // Get user info for event filtering (roles, orgs, contacts)
    const userInfo = await userRepository.getUserInfoForEvents(userId);

    if (!userInfo) {
      throw new ORPCError("UNAUTHORIZED", {
        message: "User not found or not authenticated",
      });
    }

    // Fetch all categories visible to this user
    const categories = await eventRepository.getCategories(userInfo);

    return {
      categories,
    };
  }),
});

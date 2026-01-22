import * as eventRepository from "../lib/repositories/events";
import { pub } from "../orpc";

export const webRouter = pub.web.router({
  webEventsList: pub.web.webEventsList.handler(async ({ input, context }) => {
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
        event.coordinates && event.coordinates.lat === 0 && event.coordinates.lng === 0
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
  }),
});

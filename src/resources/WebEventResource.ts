import { EventModel } from "../models/EventModel"

export function WebEventResource(event: any,  userInfo: {userId: number, msisdn: string, isSuperAdmin: boolean, emails: string[], orgIds: number[]}) {
  const eventModel = new EventModel(event)
  return {
    id: String(event.id),
    owner_id: String(event.ownerId),
    organization_id: event.groupId,
    organization: eventModel.getOrgName(),
    name: String(event.name),
    description: String(event.description || ""),
    category: String(event.category),
    location: String(event.location || ""),
    date: event.date,
    featured: Boolean(event.featured),
    duration: event.duration ?? -1,
    label: eventModel.getLabel(),
    capacity: event.capacity,
    is_public: Boolean(event.isPublic),
    is_5g: Boolean(event.is5g),
    imageUrl: eventModel.getImageUrl(true),
    organization_image_url: event.group.imageUrl ?? "",
    map_image_url: eventModel.getMapImageUrl(),
    promo_video_url: String(event.promoVideoUrl),
    promo_video_aspect_ratio: event.promoVideoUrl ? event.promoVideoAspectRatio || "fit_inside" : "",
    has_ricoh_stream: eventModel.hasRicoh(),
    payed: Boolean(event.payed),
    ticket_platform: eventModel.getTicketPlatform(),
    ticket_url: eventModel.getTicketUrl(),
    min_price: eventModel.getMinPrice(),
    invitation_message: eventModel.getInvitationMessage(),
    invitations_only: Boolean(event.invitationsOnly),
    categoryImage: eventModel.getCategoryImageUrl(),
    web_allowed: Boolean(event.webAllowed),
    app_allowed: Boolean(event.appAllowed),
    invitation_accepted: event.invitationAccepted,
    invitation_requested: eventModel.hasRequested(userInfo),
    appUrl: eventModel.getAppUrl(),
    sponsors: {
      custom: eventModel.getCustomAds(),
      settings: eventModel.getSponsorSettings(),
      external: {},
    },
    host: eventModel.getHost(),
    onLocation: eventModel.getOnLocation(),
    onLocationLock: eventModel.getOnLocationLock(),
  }
}

export function WebEventCollection(events: any[], userInfo: {userId: number, msisdn: string, isSuperAdmin: boolean, emails: string[], orgIds: number[]}) {
  return events.map(event => WebEventResource(event, userInfo))
}

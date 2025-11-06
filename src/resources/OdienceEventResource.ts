import { EventModel } from "../models/EventModel"

export function OdienceEventResource(event: any, forWeb = false, userInfo: {userId: number, msisdn: string, isSuperAdmin: boolean, emails: string[], orgIds: number[]}) {
  const eventModel = new EventModel(event)
  return {
    id: String(event.id),
    namespace: `/${event.id}`,
    name: String(event.name),
    label: eventModel.getLabel(),
    duration: event.duration ?? -1,
    date: event.date,
    featured: Boolean(event.featured),
    location: String(event.location || ""),
    brand: eventModel.getBrand(),
    featured_catalogue: eventModel.getFeaturedCatalog(),
    organization: eventModel.getOrgName(),
    organization_image_url: event.group.imageUrl ?? "",
    organization_id: event.groupId,
    owner_id: String(event.ownerId),
    description: String(event.description || ""),
    category: String(event.category),
    categoryImage: eventModel.getCategoryImageUrl(),
    capacity: event.capacity,
    is_public: Boolean(event.isPublic),
    is_5g: Boolean(event.is5g),
    imageUrl: eventModel.getImageUrl(forWeb),
    min_price: eventModel.getMinPrice(),
    ticket_url: eventModel.getTicketUrl(),
    ticket_platform: eventModel.getTicketPlatform(),
    map_image_url: eventModel.getMapImageUrl(),
    promo_video_url: String(event.promoVideoUrl),
    promo_video_aspect_ratio: event.promoVideoUrl ? (event.promoVideoAspectRatio || "fit_inside") : "",
    has_ricoh_stream: eventModel.hasRicoh(),
    payed: Boolean(event.payed),
    invitation_message: eventModel.getInvitationMessage(),
    event_url: eventModel.getAppUrl(),
    invitations_only: Boolean(event.invitationsOnly),
    usersConnected: event.usersConnected,
    complete: Boolean >= event.capacity,
    invitation_accepted: event.invitationAccepted,
    invitation_requested: eventModel.hasRequested(userInfo),
    registered: eventModel.hasRegistered(userInfo),
    usersInterestedCount: event.usersInterested.length,
    banned: eventModel.isBanned(userInfo),
    blocked: eventModel.isBlocked(userInfo),
    opened: eventModel.hasOpened(userInfo),
    pre_access: eventModel.getPreAccess(userInfo),
    web_allowed: Boolean(event.webAllowed),
    app_allowed: Boolean(event.appAllowed),
    appUrl: eventModel.getAppUrl(),
    settings: eventModel.getSettings(),
    active: Boolean(event.active),
    downloads: event.downloadUrls,
    sponsors: {custom: eventModel.getCustomAds(), settings: eventModel.getSponsorSettings(), external: {}},
    host: eventModel.getHost(),
    onLocation: eventModel.getOnLocation(),
    onLocationLock: eventModel.getOnLocationLock()
  }
}

export function OdienceEventCollection(events: any[], forWeb = false, userInfo: {userId: number, msisdn: string, isSuperAdmin: boolean, emails: string[], orgIds: number[]}) {
  return events.map(event => OdienceEventResource(event, forWeb, userInfo))
}

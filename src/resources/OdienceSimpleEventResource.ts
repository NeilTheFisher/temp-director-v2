
import { EventModel } from "../models/EventModel"

export function OdienceSimpleEventResource(event: any, forWeb = false, userInfo: {userId: number, msisdn: string, isSuperAdmin: boolean, emails: string[], orgIds: number[]}) {
  const eventModel = new EventModel(event)
  return {
    id: String(event.id),
    namespace: `/${event.id}`,
    name: String(event.name),
    label: eventModel.getLabel(),
    date: event.date,
    featured: Boolean(event.featured),
    organization: eventModel.getOrgName(),
    organization_id: event.groupId,
    owner_id: String(event.ownerId),
    description: String(event.description || ""),
    category: String(event.category),
    categoryImage: eventModel.getCategoryImageUrl(),
    is_public: Boolean(event.isPublic),
    imageUrl: eventModel.getImageUrl(forWeb),
    min_price: eventModel.getMinPrice(),
    payed: Boolean(event.payed),
    invitation_message: eventModel.getInvitationMessage(),
    invitations_only: Boolean(event.invitationsOnly),
    invitation_accepted: event.invitationAccepted,
    invitation_requested: eventModel.hasRequested(userInfo),
    registered: eventModel.hasRegistered(userInfo),
    opened: eventModel.hasOpened(userInfo),
    web_allowed: Boolean(event.webAllowed),
    app_allowed: Boolean(event.appAllowed),
    host: eventModel.getHost(),
    onLocation: eventModel.getOnLocation(),
    onLocationLock: eventModel.getOnLocationLock()
  }
}

export function OdienceSimpleEventCollection(events: any[], forWeb = false, userInfo: {userId: number, msisdn: string, isSuperAdmin: boolean, emails: string[], orgIds: number[]}) {
  return events.map(event => OdienceSimpleEventResource(event, forWeb, userInfo))
}
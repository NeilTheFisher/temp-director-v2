export function OdienceEventResource(event: any, forWeb = false) {
  return {
    id: String(event.id),
    namespace: `/${event.id}`,
    name: String(event.name),
    label: String(event.label),
    duration: event.duration ?? -1,
    date: event.date,
    featured: Boolean(event.featured),
    location: String(event.location),
    brand: null, //todo
    featured_catalogue: null, //todo
    organization: "", //todo,
    organization_image_url: "", //todo,
    organization_id: "",
    owner_id: String(event.ownerId),
    description: String(event.description),
    category: String(event.category),
    categoryImage: "", //todo,
    capacity: event.capacity,
    is_public: Boolean(event.isPublic),
    is_5g: Boolean(event.is5g),
    imageUrl: forWeb ? "" : String(event.imageUrl), //todo web,
    min_price: 0, //todo
    ticket_url: "", //todo
    ticket_platform: "", //todo
    map_image_url: "", //todo
    promo_video_url: "", //todo
    promo_video_aspect_ratio: "", //todo
    has_ricoh_stream: false, //todo
    payed: Boolean(event.payed),
    invitation_message: "", //todo
    event_url: "", //todo
    invitations_only: Boolean(event.invitationsOnly),
    usersConnected: 0, //todo
    complete: false, //todo,
    invitation_accepted: false, //todo
    invitation_requested: false, //todo
    registered: false, //todo
    usersInterestedCount: 0, //todo
    banned: false, //todo
    blocked: false, //todo
    opened: false, //todo
    pre_access: false, //todo
    web_allowed: Boolean(event.webAllowed),
    app_allowed: Boolean(event.appAllowed),
    appUrl: "", //todo
    settings: {}, //todo
    active: Boolean(event.active),
    downloads: [], //todo
    sponsors: {}, //todo
    host: "", //todo
    onLocation: false, //todo
    onLocationLock: false //todo
  }
}

export function OdienceEventCollection(events: any[], forWeb = false) {
  return events.map(e => OdienceEventResource(e, forWeb))
}
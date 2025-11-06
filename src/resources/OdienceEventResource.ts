import { S3Service } from "../services/S3Service"
import { Setting } from "../entity/Setting"
import { User } from "../entity/User"
import { Event } from "../entity/Event"
import { Stream } from "../entity/Stream"
import { Ad } from "../entity/Ad"
import { EventSimulation } from "../entity/EventSimulation"
import { SettingInterface } from "../interfaces/Setting"
import { LocationInfoInterface } from "../interfaces/LocationInfo"

const s3Service = new S3Service()

export function OdienceEventResource(event: any, forWeb = false, userInfo: {userId: number, msisdn: string, isSuperAdmin: boolean, emails: string[], orgIds: number[]}) {
  const eventSettings = getEventSettings(event.settings[0] ?? [])
  const appUrl = getAppUrl(event.id)
  return {
    id: String(event.id),
    namespace: `/${event.id}`,
    name: String(event.name),
    label: getLabel(event),
    duration: event.duration ?? -1,
    date: event.date,
    featured: Boolean(event.featured),
    location: String(event.location || ""),
    brand: getBrand(event, eventSettings),
    featured_catalogue: getFeaturedCatalog(eventSettings),
    organization: getOrgName(event.group.name, event.owner.name),
    organization_image_url: event.group.imageUrl ?? "",
    organization_id: event.groupId,
    owner_id: String(event.ownerId),
    description: String(event.description || ""),
    category: String(event.category),
    categoryImage: getCategoryImageUrl(String(event.category)),
    capacity: event.capacity,
    is_public: Boolean(event.isPublic),
    is_5g: Boolean(event.is5g),
    imageUrl: getImageUrl(String(event.imageUrl || ""), String(event.webImageUrl || ""), forWeb),
    min_price: getMinPrice(eventSettings),
    ticket_url: getTicketUrl(event, eventSettings),
    ticket_platform: getTicketPlatform(event.payed, eventSettings),
    map_image_url: getMapImageUrl(event.id),
    promo_video_url: String(event.promoVideoUrl),
    promo_video_aspect_ratio: event.promoVideoUrl ? (event.promoVideoAspectRatio || "fit_inside") : "",
    has_ricoh_stream: hasRicoh(event.streams),
    payed: Boolean(event.payed),
    invitation_message: getInvitationMessage(event, eventSettings, appUrl),
    event_url: appUrl,
    invitations_only: Boolean(event.invitationsOnly),
    usersConnected: event.usersConnected,
    complete: Boolean >= event.capacity,
    invitation_accepted: event.invitationAccepted,
    invitation_requested: hasRequested(event, userInfo),
    registered: hasRegistered(event, userInfo),
    usersInterestedCount: event.usersInterested.length,
    banned: isBanned(event, userInfo),
    blocked: isBlocked(event, userInfo),
    opened: hasOpened(event, userInfo),
    pre_access: getPreAccess(event.ownerId, event.groupId, userInfo),
    web_allowed: Boolean(event.webAllowed),
    app_allowed: Boolean(event.appAllowed),
    appUrl: appUrl,
    settings: getSettings(eventSettings),
    active: Boolean(event.active),
    downloads: getDownloadUrls(event.streams),
    sponsors: {custom: getCustomAds(event.id, event.ads), settings: getSponsorSettings(eventSettings), external: {}},
    host: getHost(eventSettings, event.owner),
    onLocation: getOnLocation(event.location_info),
    onLocationLock: getOnLocationLock(event.location_info)
  }
}

export function OdienceEventCollection(events: any[], forWeb = false, userInfo: {userId: number, msisdn: string, isSuperAdmin: boolean, emails: string[], orgIds: number[]}) {
  return events.map(event => OdienceEventResource(event, forWeb, userInfo))
}

function getOrgName(strGroupName: string, strOwnerName?: string): string {
  if (strGroupName.includes("PrivateGroup:[") && strOwnerName) {
    return strOwnerName
  }
  return strGroupName
}

function getCategoryImageUrl(category: string): string{
  return s3Service.getUrlFromPath(`tags/${category}.png`)
}

function getImageUrl(imageUrl: string|null, webImageUrl: string|null, forWeb = false)
{
  if (forWeb && webImageUrl) {
    return webImageUrl
  }
  return imageUrl
}

function getSettings(settings: SettingInterface)
{
  return {
    event_feature_chat: String(settings[Setting.EVENT_FEATURE_CHAT] || "on") === "on",
    message_interval: parseInt(settings[Setting.MESSAGE_INTERVAL] ?? 1),
    event_message_reminder: parseInt(settings[Setting.EVENT_MESSAGE_REMINDER] ?? 1800),
    event_end_reminder_interval: parseInt(settings[Setting.EVENT_END_REMINDER_INTERVAL] ?? 0),
    time_limited_invitation: String(settings[Setting.TIME_LIMITED_INVITATION] || "on"),
    videowall_request_invite_duration: parseInt(settings[Setting.VIDEO_WALL_REQUEST_INVITE_DURATION] ?? 10),
    videowall_reaction_duration_interval: parseInt(settings[Setting.VIDEO_WALL_REQUEST_INVITE_DURATION] ?? 15),
    videowall_call_resolution: String(settings[Setting.VIDEO_WALL_CALL_RESOLUTION] || "SD"),
    nft_bot: String(settings[Setting.NFT_BOT] || "off"),
    hq_zoom:  parseInt(settings[Setting.HQ_ZOOM] ?? 1) === 1,
    automatic_sms_items: String(settings[Setting.AUTOMATIC_SMS_ITEMS] || "on"),
    maximum_stream_messages: parseInt(settings[Setting.MAXIMUM_STREAM_MESSAGES] ?? 100),
    chat_profanity: String(settings[Setting.CHAT_PROFANITY] ?? "on")
  }
}

function getOnLocation(location_info: LocationInfoInterface)
{
  return Boolean(location_info?.on_location_feature ?? 0)
}

function getOnLocationLock(location_info: LocationInfoInterface)
{
  return Boolean(location_info?.location_lock ?? 0)
}

function getBrand(event: any, settings: SettingInterface)
{
  const date = new Date(event.date * 1000)
  const formattedDate = new Intl.DateTimeFormat("en-US", {month: "long",day: "numeric",year: "numeric"}).format(date)
  return {
    show_brand_panel: parseInt(settings[Setting.SHOW_BRAND_PANEL] ?? 1) === 1,
    brand_title: !settings[Setting.BRAND_TITLE] || settings[Setting.BRAND_TITLE] === "" ? event.name : settings[Setting.BRAND_TITLE],
    brand_subtitle: !settings[Setting.BRAND_SUBTITLE] || settings[Setting.BRAND_SUBTITLE] === "" ? formattedDate : settings[Setting.BRAND_SUBTITLE],
    brand_background_color: settings[Setting.BRAND_BACKGROUND_COLOR] || "#DF2C48",
    brand_text_color: settings[Setting.BRAND_TEXT_COLOR] || "#FFFFFF",
    brand_image_url: event.brand_image_url || s3Service.getUrlFromPath("default/odience.png"),
    brand_background_image_url: event.brand_background_image_url || "",
    brand_ad_image_url: event.brand_ad_image_url || "",
    brand_background_opacity: !settings[Setting.BRAND_BACKGROUND_OPACITY] || settings[Setting.BRAND_BACKGROUND_OPACITY] === "" ? 1: parseFloat(settings[Setting.BRAND_BACKGROUND_OPACITY]),
    brand_logo_padding: !settings[Setting.BRAND_LOGO_PADDING] || settings[Setting.BRAND_LOGO_PADDING] === "" ? 0.4: parseFloat(settings[Setting.BRAND_LOGO_PADDING]),
  }
}

function getFeaturedCatalog(settings: SettingInterface)
{
  return {
    image_alignment: settings[Setting.FEATURED_CATALOG_IMAGE_ALIGNMENT] || "scalefit",
    blurred_background: parseInt(settings[Setting.FEATURED_CATALOG_BLURRED_BACKGROUND] || 0) === 1,
  }
}

function getTickets(settings: SettingInterface): any | null {
  let ticketLevels: any | null = null

  try {
    const rawValue = String(settings[Setting.EVENT_TICKET_LEVELS] ?? "")
    ticketLevels = JSON.parse(rawValue)
  } catch (error) {
    console.error("OdienceEventResource.getTickets:", error)
  }

  return ticketLevels ?? null
}

function getTicketPlatform(payed: boolean, settings: SettingInterface): string {
  return payed ? String(settings[Setting.EVENT_TICKET_PLATFORM] ?? "") : ""
}

function getTicketUrl(event: any, settings: SettingInterface): string {
  let ticketUrl = ""
  try {
    if (event.payed) {
      const eventPlatform = settings[Setting.EVENT_TICKET_PLATFORM]

      if (eventPlatform === Setting.EVENT_PLATFORM_TYPE_EVENTBRITE) {
        ticketUrl = settings[Setting.EVENTBRITE_EVENT_URL] || ""
      } else if (eventPlatform === Setting.EVENT_PLATFORM_TYPE_ODIENCE) {
        // Assuming you have a function to generate routes or URLs
        ticketUrl = `https://${process.env.DIRECTOR_PUBLIC_SOCKET_ADDRESS}/purchaseEventTicket/${event.id}`
      }
    }
  } catch (error) {
    console.error("OdienceEventResource.getTicketUrl:", error)
  }

  return ticketUrl
}

function getMinPrice(settings: SettingInterface): number {
  let minPrice = 0
  try {
    const tickets = getTickets(settings) ?? []

    for (const [index, ticket] of tickets.entries()) {
      const price = parseFloat(ticket.price)

      if (index === 0) {
        minPrice = price
      } else if (price < minPrice) {
        minPrice = price
      }
    }
  } catch (error) {
    console.error("OdienceEventResource.getMinPrice:", error)
  }

  return minPrice > 0 && minPrice < 1 ? 1 : Math.floor(minPrice)
}

function getMapImageUrl(eventId: number)
{
  return `https://${process.env.DIRECTOR_PUBLIC_SOCKET_ADDRESS}/mobile/mapImage/${eventId}?date=${Date.now()}`
}

function getEventSettings(settings: any)
{
  const value = settings ? settings.value : ""
  let result = []
  if(value != null)
  {
    result = JSON.parse(value)
  }
  return result
}

function getPreAccess(ownerId: number, groupId: number, userInfo: {userId: number, msisdn: string, isSuperAdmin: boolean, emails: string[], orgIds: number[]})
{
  return userInfo.isSuperAdmin || (ownerId === userInfo.userId || userInfo.orgIds.includes(groupId))
}

function getHost(settings: SettingInterface, owner: User)
{
  return  settings[Setting.EVENT_ASSISTANT_PHONE_NUMBER] || (owner.msisdn || "")
}

function getAppUrl(eventId: number)
{
  return `https://${process.env.DIRECTOR_PUBLIC_SOCKET_ADDRESS}/o/${eventId}`
}

function  getInvitationMessage(event: Event, arrEventSettings: SettingInterface, eventAppUrl: string): string {
  const strMessage = arrEventSettings[Setting.EVENT_INVITATION_MESSAGE] || ""

  return strMessage.replace(
    /\[eventName\]|\[orgName\]|\[eventDate\]|\[eventDescription\]|\[invitationUrl\]|\[eventId\]|\[orgId\]|\\r|\\n/g,
    (match: string) => {
      switch(match) {
      case "[eventName]": return event.name
      case "[orgName]": return getOrgName(event.group.name ?? "", event.owner.name ?? "")
      case "[eventDate]":
        if (event.date) {
          const dateObj = new Date(event.date * 1000) // convert seconds -> milliseconds
          return dateObj.toLocaleString("en-US", {
            month: "long",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false, // 24-hour format like PHP H:i
          })
        }
        return ""
      case "[eventDescription]": return event.description
      case "[invitationUrl]": return eventAppUrl
      case "[eventId]": return String(event.id)
      case "[orgId]": return String(event.groupId)
      case "\\r": return "\r"
      case "\\n": return "\n"
      default: return match
      }
    }
  )
}

function isBanned(event: Event, userInfo: {userId: number, msisdn: string, isSuperAdmin: boolean, emails: string[], orgIds: number[]})
{
  return event.usersRemoved.some(user => user.msisdn === userInfo.msisdn)
}

function isBlocked(event: Event, userInfo: {userId: number, msisdn: string, isSuperAdmin: boolean, emails: string[], orgIds: number[]})
{
  return event.usersBlocked.some(user => user.msisdn === userInfo.msisdn)
}

function hasOpened(event: Event, userInfo: {userId: number, msisdn: string, isSuperAdmin: boolean, emails: string[], orgIds: number[]})
{
  return event.usersOpened.some(user => user.msisdn === userInfo.msisdn)
}

function hasRequested(event: Event, userInfo: {userId: number, msisdn: string, isSuperAdmin: boolean, emails: string[], orgIds: number[]})
{
  return event.eventRequests.some(user => user.msisdn === userInfo.msisdn)
}

function hasRegistered(event: Event, userInfo: {userId: number, msisdn: string, isSuperAdmin: boolean, emails: string[], orgIds: number[]})
{
  return event.usersRegistered.some(user => user.msisdn === userInfo.msisdn)
}

function getSponsorSettings(eventSettings: SettingInterface)
{
  const settings: Record<string, Record<string, number>> = {}
  const SPONSOR_SETTING_KEYS: Record<string, string[]> = Setting.SPONSOR_SETTING_KEYS
  for (const [location, settingKeys] of Object.entries(SPONSOR_SETTING_KEYS)) {
    settings[location] = {}

    for (const settingKey of settingKeys) {
      let value = parseInt(eventSettings[settingKey] ?? "", 10) || 0

      if (settingKey === Setting.AD_INSIDE_STREAM_DISPLAY_INTERVAL) {
        value *= 60
      }

      settings[location][settingKey] = value
    }
  }

  return settings
}

function getLabel(event: Event): string
{
  const now = new Date().valueOf() / 1000
  const streams: Stream[] = event.streams
  if (!event.active) return Event.EVENT_STATUS_DEACTIVATED
  if (event.isDraft)  return Event.EVENT_STATUS_DRAFT
  if (event.duration && event.date && event.date + event.duration <= now)
    return Event.EVENT_STATUS_ENDED
  if (streams.length == 0) return Event.EVENT_STATUS_DRAFT
  const event_simulations : EventSimulation[] = event.eventSimulations || []

  if (event.date && event.date <= now && (event.duration == null || event.date + event.duration > now))
  {
    if(streams.length === 0 && event_simulations.length > 0)
      return Event.EVENT_STATUS_LIVE
    if (undefined != streams.find((stream:Stream) => stream.recordedType == 0))
      return Event.EVENT_STATUS_LIVE
    if (event.restream || undefined != streams.find((stream:Stream) => stream.recordedType == 1) ) //nvr live
      return Event.EVENT_STATUS_RE_STREAM
    if (undefined != streams.find((stream:Stream) => stream.recordedType == 2))  //nvr live or resteam
      return Event.EVENT_STATUS_ON_DEMAND
  }
  if (event.date && event.date > now)
    return Event.EVENT_STATUS_UPCOMING

  return Event.EVENT_STATUS_DEACTIVATED
}

function hasRicoh(streams: Stream[])
{
  return streams.some(stream => stream.code && stream.code.trim() !== "")
}

function getDownloadUrls(streams: Stream[])
{
  return Array.from(
    new Set(
      streams.flatMap((stream: Stream) =>
        stream.streamUrls
          .map(url => url.downloadUrl)
          .filter(u => u) // remove null/undefined/empty strings
      )
    )
  )
}

function getCustomAds(eventId: number, ads: Ad[])
{
  const mapped = ads.map((ad) => {
    const mediaUrl = ad.mediaUrl ?? ""
    const mediaType =
      !mediaUrl ? "" : mediaUrl.includes(".mp4") ? "video" : "image"

    return {
      id: ad.id,
      name: ad.name,
      media_url: mediaUrl,
      media_type: mediaType,
      url: ad.url,
      location: ad.location,
      sponsor_name: ad.sponsor?.name ?? "",
      clickUrl: getAddClickUrl(eventId, ad.id),
    }
  })

  // group by location
  const grouped: Record<string, any[]> = {}
  for (const ad of mapped) {
    if (!grouped[ad.location]) {
      grouped[ad.location] = []
    }
    grouped[ad.location].push(ad)
  }

  return grouped
}

function getAddClickUrl(eventId: number, adId: number)
{
  return `https://${process.env.DIRECTOR_PUBLIC_SOCKET_ADDRESS}/add/click/${eventId}/${adId}`
}
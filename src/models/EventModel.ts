import { S3Service } from "../services/S3Service"
import { Setting } from "../entity/Setting"
import { Event } from "../entity/Event"
import { Stream } from "../entity/Stream"
import { EventSimulation } from "../entity/EventSimulation"
import { SettingInterface } from "../interfaces/Setting"

export class EventModel {
private event: Event
private eventSettings: SettingInterface
private s3Service = new S3Service()
constructor(event:Event) {
  this.event = event
  this.eventSettings = this.getEventSettings(event.settings)
}
getOrgName(): string {
  const groupName = this.event.group.name
  const ownerName = this.event?.owner?.name ?? null
  if (groupName.includes("PrivateGroup:[") && ownerName) {
    return ownerName
  }
  return groupName
}

getCategoryImageUrl(): string{
  return this.s3Service.getUrlFromPath(`tags/${this.event.category}.png`)
}

getImageUrl(forWeb = false)
{
  const imageUrl = this.event.imageUrl || ""
  const webImageUrl =this.event.webImageUrl || ""
  if (forWeb && webImageUrl) {
    return webImageUrl
  }
  return imageUrl
}

getSettings()
{
  return {
    event_feature_chat: String(this.eventSettings[Setting.EVENT_FEATURE_CHAT] || "on") === "on",
    message_interval: parseInt(this.eventSettings[Setting.MESSAGE_INTERVAL] ?? 1),
    event_message_reminder: parseInt(this.eventSettings[Setting.EVENT_MESSAGE_REMINDER] ?? 1800),
    event_end_reminder_interval: parseInt(this.eventSettings[Setting.EVENT_END_REMINDER_INTERVAL] ?? 0),
    time_limited_invitation: String(this.eventSettings[Setting.TIME_LIMITED_INVITATION] || "on"),
    videowall_request_invite_duration: parseInt(this.eventSettings[Setting.VIDEO_WALL_REQUEST_INVITE_DURATION] ?? 10),
    videowall_reaction_duration_interval: parseInt(this.eventSettings[Setting.VIDEO_WALL_REQUEST_INVITE_DURATION] ?? 15),
    videowall_call_resolution: String(this.eventSettings[Setting.VIDEO_WALL_CALL_RESOLUTION] || "SD"),
    nft_bot: String(this.eventSettings[Setting.NFT_BOT] || "off"),
    hq_zoom:  parseInt(this.eventSettings[Setting.HQ_ZOOM] ?? 1) === 1,
    automatic_sms_items: String(this.eventSettings[Setting.AUTOMATIC_SMS_ITEMS] || "on"),
    maximum_stream_messages: parseInt(this.eventSettings[Setting.MAXIMUM_STREAM_MESSAGES] ?? 100),
    chat_profanity: String(this.eventSettings[Setting.CHAT_PROFANITY] ?? "on")
  }
}

getOnLocation()
{
  return Boolean(this.event.locationInfo?.on_location_feature ?? 0)
}

getOnLocationLock()
{
  return Boolean(this.event.locationInfo?.location_lock ?? 0)
}

getBrand()
{
  const date = new Date(this.event.date * 1000)
  const formattedDate = new Intl.DateTimeFormat("en-US", {month: "long",day: "numeric",year: "numeric"}).format(date)
  return {
    show_brand_panel: parseInt(this.eventSettings[Setting.SHOW_BRAND_PANEL] ?? 1) === 1,
    brand_title: !this.eventSettings[Setting.BRAND_TITLE] || this.eventSettings[Setting.BRAND_TITLE] === "" ? this.event.name : this.eventSettings[Setting.BRAND_TITLE],
    brand_subtitle: !this.eventSettings[Setting.BRAND_SUBTITLE] || this.eventSettings[Setting.BRAND_SUBTITLE] === "" ? formattedDate : this.eventSettings[Setting.BRAND_SUBTITLE],
    brand_background_color: this.eventSettings[Setting.BRAND_BACKGROUND_COLOR] || "#DF2C48",
    brand_text_color: this.eventSettings[Setting.BRAND_TEXT_COLOR] || "#FFFFFF",
    brand_image_url: this.event.brandImageUrl || this.s3Service.getUrlFromPath("default/odience.png"),
    brand_background_image_url: this.event.brandBackgroundImageUrl || "",
    brand_ad_image_url: this.event.brandAdImageUrl || "",
    brand_background_opacity: !this.eventSettings[Setting.BRAND_BACKGROUND_OPACITY] || this.eventSettings[Setting.BRAND_BACKGROUND_OPACITY] === "" ? 1: parseFloat(this.eventSettings[Setting.BRAND_BACKGROUND_OPACITY]),
    brand_logo_padding: !this.eventSettings[Setting.BRAND_LOGO_PADDING] || this.eventSettings[Setting.BRAND_LOGO_PADDING] === "" ? 0.4: parseFloat(this.eventSettings[Setting.BRAND_LOGO_PADDING]),
  }
}

getFeaturedCatalog()
{
  return {
    image_alignment: this.eventSettings[Setting.FEATURED_CATALOG_IMAGE_ALIGNMENT] || "scalefit",
    blurred_background: parseInt(this.eventSettings[Setting.FEATURED_CATALOG_BLURRED_BACKGROUND] || 0) === 1,
  }
}

getTickets(): any | null {
  const rawValue = String(this.eventSettings?.[Setting.EVENT_TICKET_LEVELS] ?? "").trim()

  if (!rawValue) {
    // nothing to parse
    return null
  }

  try {
    return JSON.parse(rawValue)
  } catch (error) {
    console.error("OdienceEventResource.getTickets: Invalid JSON in EVENT_TICKET_LEVELS", error)
    return null
  }
}

getTicketPlatform(): string {
  return this.event.payed ? String(this.eventSettings[Setting.EVENT_TICKET_PLATFORM] ?? "") : ""
}

getTicketUrl(): string {
  let ticketUrl = ""
  try {
    if (this.event.payed) {
      const eventPlatform = this.eventSettings[Setting.EVENT_TICKET_PLATFORM]

      if (eventPlatform === Setting.EVENT_PLATFORM_TYPE_EVENTBRITE) {
        ticketUrl = this.eventSettings[Setting.EVENTBRITE_EVENT_URL] || ""
      } else if (eventPlatform === Setting.EVENT_PLATFORM_TYPE_ODIENCE) {
        // Assuming you have a function to generate routes or URLs
        ticketUrl = `https://${process.env.DIRECTOR_PUBLIC_SOCKET_ADDRESS}/purchaseEventTicket/${this.event.id}`
      }
    }
  } catch (error) {
    console.error("OdienceEventResource.getTicketUrl:", error)
  }

  return ticketUrl
}

getMinPrice(): number {
  let minPrice = 0
  try {
    const tickets = this.getTickets() ?? []

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

getMapImageUrl()
{
  return `https://${process.env.DIRECTOR_PUBLIC_SOCKET_ADDRESS}/mobile/mapImage/${this.event.id}?date=${Date.now()}`
}

getEventSettings(settings: any)
{
  const value = settings ? settings.value : ""
  let result = []
  if(value != null)
  {
    result = JSON.parse(value)
  }
  return result
}

getPreAccess(userInfo: {userId: number, msisdn: string, isSuperAdmin: boolean, emails: string[], orgIds: number[]})
{
  return userInfo.isSuperAdmin || (this.event.ownerId === userInfo.userId || userInfo.orgIds.includes(this.event.groupId))
}

getHost()
{
  return  this.eventSettings[Setting.EVENT_ASSISTANT_PHONE_NUMBER] || (this.event.owner.msisdn || "")
}

getAppUrl()
{
  return `https://${process.env.DIRECTOR_PUBLIC_SOCKET_ADDRESS}/o/${this.event.id}`
}

getInvitationMessage(): string {
  const strMessage = this.eventSettings[Setting.EVENT_INVITATION_MESSAGE] || ""

  return strMessage.replace(
    /\[eventName\]|\[orgName\]|\[eventDate\]|\[eventDescription\]|\[invitationUrl\]|\[eventId\]|\[orgId\]|\\r|\\n/g,
    (match: string) => {
      switch(match) {
      case "[eventName]": return this.event.name
      case "[orgName]": return this.getOrgName()
      case "[eventDate]":
        if (this.event.date) {
          const dateObj = new Date(this.event.date * 1000) // convert seconds -> milliseconds
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
      case "[eventDescription]": return this.event.description
      case "[invitationUrl]": return this.getAppUrl()
      case "[eventId]": return String(this.event.id)
      case "[orgId]": return String(this.event.groupId)
      case "\\r": return "\r"
      case "\\n": return "\n"
      default: return match
      }
    }
  )
}

isBanned(userInfo: {userId: number, msisdn: string, isSuperAdmin: boolean, emails: string[], orgIds: number[]})
{
  return this.event.usersRemoved.some(user => user.msisdn === userInfo.msisdn)
}

isBlocked(userInfo: {userId: number, msisdn: string, isSuperAdmin: boolean, emails: string[], orgIds: number[]})
{
  return this.event.usersBlocked.some(user => user.msisdn === userInfo.msisdn)
}

hasOpened(userInfo: {userId: number, msisdn: string, isSuperAdmin: boolean, emails: string[], orgIds: number[]})
{
  return this.event.usersOpened.some(user => user.msisdn === userInfo.msisdn)
}

hasRequested(userInfo: {userId: number, msisdn: string, isSuperAdmin: boolean, emails: string[], orgIds: number[]})
{
  return this.event.eventRequests.some(user => user.msisdn === userInfo.msisdn)
}

hasRegistered(userInfo: {userId: number, msisdn: string, isSuperAdmin: boolean, emails: string[], orgIds: number[]})
{
  return this.event.usersRegistered.some(user => user.msisdn === userInfo.msisdn)
}

getSponsorSettings()
{
  const settings: Record<string, Record<string, number>> = {}
  const SPONSOR_SETTING_KEYS: Record<string, string[]> = Setting.SPONSOR_SETTING_KEYS
  for (const [location, settingKeys] of Object.entries(SPONSOR_SETTING_KEYS)) {
    settings[location] = {}

    for (const settingKey of settingKeys) {
      let value = parseInt(this.eventSettings[settingKey] ?? "", 10) || 0

      if (settingKey === Setting.AD_INSIDE_STREAM_DISPLAY_INTERVAL) {
        value *= 60
      }

      settings[location][settingKey] = value
    }
  }

  return settings
}

getLabel(): string
{
  const now = new Date().valueOf() / 1000
  const streams: Stream[] = this.event.streams
  if (!this.event.active) return Event.EVENT_STATUS_DEACTIVATED
  if (this.event.isDraft)  return Event.EVENT_STATUS_DRAFT
  if (this.event.duration && this.event.date && this.event.date + this.event.duration <= now)
    return Event.EVENT_STATUS_ENDED
  if (streams.length == 0) return Event.EVENT_STATUS_DRAFT
  const event_simulations : EventSimulation[] = this.event.eventSimulations || []

  if (this.event.date && this.event.date <= now && (this.event.duration == null || this.event.date + this.event.duration > now))
  {
    if(streams.length === 0 && event_simulations.length > 0)
      return Event.EVENT_STATUS_LIVE
    if (undefined != streams.find((stream:Stream) => stream.recordedType == 0))
      return Event.EVENT_STATUS_LIVE
    if (this.event.restream || undefined != streams.find((stream:Stream) => stream.recordedType == 1) ) //nvr live
      return Event.EVENT_STATUS_RE_STREAM
    if (undefined != streams.find((stream:Stream) => stream.recordedType == 2))  //nvr live or resteam
      return Event.EVENT_STATUS_ON_DEMAND
  }
  if (this.event.date && this.event.date > now)
    return Event.EVENT_STATUS_UPCOMING

  return Event.EVENT_STATUS_DEACTIVATED
}

hasRicoh()
{
  return this.event.streams.some(stream => stream.code && stream.code.trim() !== "")
}

getCustomAds()
{
  const mapped = this.event.ads.map((ad) => {
    const mediaUrl = ad.mediaUrl ?? ""
    const mediaType = !mediaUrl ? "" : mediaUrl.includes(".mp4") ? "video" : "image"
    return {
      id: ad.id,
      name: ad.name,
      media_url: mediaUrl,
      media_type: mediaType,
      url: ad.url,
      location: ad.location,
      sponsor_name: ad.sponsor?.name ?? "",
      clickUrl: this.getAddClickUrl(ad.id),
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

getAddClickUrl(adId: number)
{
  return `https://${process.env.DIRECTOR_PUBLIC_SOCKET_ADDRESS}/add/click/${this.event.id}/${adId}`
}

}


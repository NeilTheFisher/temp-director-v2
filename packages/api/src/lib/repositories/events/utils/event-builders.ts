import { env } from "@director_v2/config";

/**
 * Helper to safely coerce settings values to strings
 */
function settingToString(value: unknown, fallback = ""): string {
  if (typeof value === "string") {
    return value;
  }
  return fallback;
}

/**
 * Helper to safely coerce settings values to numbers
 */
function settingToNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
}

/**
 * Helper to safely coerce settings values to floats
 */
function settingToFloat(value: unknown, fallback = 0): number {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
}

/**
 * Get S3 URL for a given path
 */
export function getS3Url(path: string): string {
  return `${env.AWS_URL}/${path}`;
}

/**
 * Parse and extract ticket settings from event settings
 */
export function getTicketSettings(settings: Record<string, unknown>) {
  const ticketLevels = settingToString(settings.event_ticket_levels).trim();
  const ticketPlatform = settingToString(settings.event_ticket_platform);

  let tickets: Array<{ price: string }> = [];
  if (ticketLevels) {
    try {
      tickets = JSON.parse(ticketLevels) as Array<{ price: string }>;
    } catch {
      tickets = [];
    }
  }

  return { tickets, ticketPlatform };
}

/**
 * Build ticket URL based on platform
 */
export function getTicketUrl(
  eventId: bigint,
  payed: boolean,
  ticketPlatform: string,
  eventbriteUrl: string,
): string {
  if (!payed) return "";

  if (ticketPlatform === "event_brite") {
    return eventbriteUrl || "";
  }
  if (ticketPlatform === "odience") {
    return `${env.DIRECTOR_URL}/purchaseEventTicket/${eventId}`;
  }
  return "";
}

/**
 * Build brand data from event and settings
 */
export function getBrandData(
  eventName: string,
  eventDate: number | null,
  brandImageUrl: string | null,
  brandBackgroundImageUrl: string | null,
  brandAdImageUrl: string | null,
  settings: Record<string, unknown>,
) {
  const date = eventDate ? new Date(eventDate * 1000) : new Date();
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);

  const showBrandPanel = settingToNumber(settings.show_brand_panel, 1) === 1;
  const brandTitle = settingToString(settings.brand_title) || eventName;
  const brandSubtitle =
    settingToString(settings.brand_subtitle) || formattedDate;

  return {
    show_brand_panel: showBrandPanel,
    brand_title: brandTitle,
    brand_subtitle: brandSubtitle,
    brand_background_color: settingToString(
      settings.brand_background_color,
      "#DF2C48",
    ),
    brand_text_color: settingToString(settings.brand_text_color, "#FFFFFF"),
    brand_image_url: brandImageUrl || getS3Url("default/odience.png"),
    brand_background_image_url: brandBackgroundImageUrl || "",
    brand_ad_image_url: brandAdImageUrl || "",
    brand_background_opacity: settingToFloat(
      settings.brand_background_opacity,
      1,
    ),
    brand_logo_padding: settingToFloat(settings.brand_logo_padding, 0.4),
  };
}

/**
 * Build invitation message with placeholders replaced
 */
export function getInvitationMessage(
  eventId: bigint,
  eventName: string,
  eventDate: number | null,
  eventDescription: string,
  orgName: string,
  groupId: bigint,
  settings: Record<string, unknown>,
  appUrl: string,
): string {
  const message = settingToString(settings.event_invitation_message);

  let dateFormatted = "";
  if (eventDate) {
    const dateObj = new Date(eventDate * 1000);
    dateFormatted = dateObj
      .toLocaleString("en-US", {
        // TODO get proper timezone
        timeZone: "America/New_York",
        month: "long",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(" at ", " @ ");
  }

  return message.replace(
    /\[eventName\]|\[orgName\]|\[eventDate\]|\[eventDescription\]|\[invitationUrl\]|\[eventId\]|\[orgId\]|\\r|\\n/g,
    (_match: string) => {
      switch (_match) {
        case "[eventName]":
          return eventName;
        case "[orgName]":
          return orgName;
        case "[eventDate]":
          return dateFormatted;
        case "[eventDescription]":
          return eventDescription;
        case "[invitationUrl]":
          return appUrl;
        case "[eventId]":
          return String(eventId);
        case "[orgId]":
          return String(groupId);
        case "\\r":
          return "\r";
        case "\\n":
          return "\n";
        default:
          return _match;
      }
    },
  );
}

/**
 * Get sponsor settings from event settings
 */
export function getSponsorSettings(
  settings: Record<string, unknown>,
): Record<string, Record<string, number>> {
  const sponsorSettings: Record<string, Record<string, number>> = {
    event_brand_panel: {
      ad_brand_panel_display_interval: settingToNumber(
        settings.ad_brand_panel_display_interval,
        10,
      ),
    },
    event_details: {
      ad_event_details_display_interval: settingToNumber(
        settings.ad_event_details_display_interval,
        10,
      ),
    },
    event_in_stream: {
      ad_inisde_stream_show_interval:
        settingToNumber(settings.ad_inisde_stream_show_interval, 15) * 60,
      ad_inside_stream_display_delay: settingToNumber(
        settings.ad_inside_stream_display_delay,
        0,
      ),
      ad_inside_stream_skip_after: settingToNumber(
        settings.ad_inside_stream_skip_after,
        5,
      ),
    },
    event_invitation: {
      ad_invitation_page_display_interval: settingToNumber(
        settings.ad_invitation_page_display_interval,
        10,
      ),
    },
  };
  return sponsorSettings;
}

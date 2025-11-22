import { env } from "@director_v2/config";
import type { listEventsResponseSchema } from "@director_v2/contracts/contract/event";
import prisma from "@director_v2/db";
import type { Prisma } from "@director_v2/db/prisma/generated/client";
import { regex } from "arkregex";
import { redis } from "bun";

interface UserInfo {
  userId: number;
  msisdn: string;
  isSuperAdmin: boolean;
  emails: string[];
  orgIds: number[];
}

interface EventQueryParams {
  category?: string;
  date?: number;
  location?: string;
  per_page?: number;
  current_page?: number;
  clientIp?: string;
  isPartial?: boolean;
  isWeb?: boolean;
  id?: string;
  isWebApi?: boolean;
}

/**
 * Check if user has an invitation to an event
 */
function hasUserInvite(
  invites: Array<{ recipient: string }>,
  userInfo: UserInfo,
): boolean {
  const recipients = new Set(invites.map((i) => i.recipient));
  if (recipients.has(userInfo.msisdn)) return true;
  return userInfo.emails.some((email) => recipients.has(email));
}

/**
 * Check IP is allowed based on location restrictions
 */
function isIpAllowed(allowedIps: string | string[], clientIp: string) {
  if (!clientIp) return false;
  const ips = Array.isArray(allowedIps) ? allowedIps : [allowedIps];
  return ips.some((ip: string) => {
    if (!ip) return false;
    // Support CIDR notation and partial IP matches
    if (ip.includes("/")) {
      // Simple CIDR check - just match the prefix
      const [prefix] = ip.split("/");
      return clientIp.startsWith(prefix || "");
    }
    return clientIp.includes(ip) || clientIp.startsWith(ip);
  });
}

/**
 * Calculate distance between two lat/lng points in meters
 * Uses Haversine formula
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  return (
    6371 *
    2000 *
    Math.asin(
      Math.sin(((lat1 - lat2) * Math.PI) / 360) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(((lon1 - lon2) * Math.PI) / 360) ** 2,
    )
  );
}

/**
 * Check location-based access for events with location restrictions
 */
async function checkLocationAccess(
  event: {
    id: bigint;
    location_info: Prisma.JsonValue;
  },
  userInfo: UserInfo,
  clientIp: string,
) {
  const locationInfo = event.location_info as Record<string, unknown> | null;
  const boolLocked = locationInfo?.location_lock ?? false;

  if (!boolLocked) {
    return true;
  }

  // Check IP-based access
  if (locationInfo?.location_ips) {
    const allowed = isIpAllowed(
      locationInfo.location_ips as string | string[],
      clientIp,
    );
    if (allowed) return true;
  }

  try {
    const eventLatitude = (locationInfo?.location_latitude as number) || 0;
    const eventLongitude = (locationInfo?.location_longitude as number) || 0;
    const eventAccessRange =
      (locationInfo?.location_access_range as number) || 100;

    if (!eventLatitude || !eventLongitude) {
      return false;
    }

    // Fetch user coordinates from Redis cache
    const cacheKey = `{user:${userInfo.msisdn}}:coordinates`;
    const cachedData = await redis.get(cacheKey);

    if (!cachedData) {
      return false;
    }

    const coordinates = JSON.parse(cachedData) as {
      latitude: number;
      longitude: number;
    };
    const distance = calculateDistance(
      eventLatitude,
      eventLongitude,
      coordinates.latitude,
      coordinates.longitude,
    );

    return distance <= eventAccessRange;
  } catch (error) {
    console.error("Redis location check failed:", error);
    return false;
  }
}

/**
 * Determine if user has accepted invitation to an event
 */
async function getInvitationAccepted(
  event: {
    id: bigint;
    location_info: Prisma.JsonValue;
    invites: Array<{ recipient: string }>;
  },
  userInfo: UserInfo,
  clientIp = "",
): Promise<boolean> {
  let invitationAccepted = hasUserInvite(event.invites || [], userInfo);

  if (!invitationAccepted) {
    invitationAccepted = await checkLocationAccess(event, userInfo, clientIp);
  }

  return invitationAccepted;
}

/**
 * Get S3 URL for a given path
 */
function getS3Url(path: string): string {
  const s3Bucket = process.env.AWS_S3_BUCKET ?? "odience-assets";
  const s3Region = process.env.AWS_S3_REGION ?? "eu-west-1";
  return `https://${s3Bucket}.s3.${s3Region}.amazonaws.com/${path}`;
}

/**
 * Calculate event status label based on current state
 */
function getEventLabel(
  date: number | null,
  duration: number | null,
  active: boolean,
  isDraft: boolean,
  streams: Array<{ recordedType: number }>,
  hasSimulations: boolean,
  restream: boolean,
): string {
  const EVENT_STATUS_LIVE = "live";
  const EVENT_STATUS_RE_STREAM = "re-stream";
  const EVENT_STATUS_ON_DEMAND = "on-demand";
  const EVENT_STATUS_DRAFT = "draft";
  const EVENT_STATUS_ENDED = "ended";
  const EVENT_STATUS_UPCOMING = "upcoming";
  const EVENT_STATUS_DEACTIVATED = "deactivated";

  const now = Math.floor(Date.now() / 1000);

  if (!active) return EVENT_STATUS_DEACTIVATED;
  if (isDraft) return EVENT_STATUS_DRAFT;
  if (duration && date && date + duration <= now) return EVENT_STATUS_ENDED;

  const hasStreams = streams.length > 0;
  const hasType0 = streams.some((s) => s.recordedType === 0);
  const hasType1 = streams.some((s) => s.recordedType === 1);
  const hasType2 = streams.some((s) => s.recordedType === 2);

  if (!hasStreams && !hasSimulations) return EVENT_STATUS_DRAFT;

  const isWithinWindow =
    !!date && date <= now && (duration === null || date + duration > now);

  if (isWithinWindow && (restream || (!hasType0 && hasType1))) {
    return EVENT_STATUS_RE_STREAM;
  }

  if (isWithinWindow && (hasType0 || hasSimulations)) {
    return EVENT_STATUS_LIVE;
  }

  if (isWithinWindow && !hasType0 && !hasType1 && hasType2) {
    return EVENT_STATUS_ON_DEMAND;
  }

  if (date && date > now) return EVENT_STATUS_UPCOMING;

  if (isWithinWindow) return EVENT_STATUS_LIVE;

  return EVENT_STATUS_DEACTIVATED;
}

/**
 * Parse and extract ticket settings from event settings
 */
function getTicketSettings(settings: Record<string, unknown>) {
  const ticketLevels = settings.event_ticket_levels
    ? String(settings.event_ticket_levels).trim()
    : "";
  const ticketPlatform = settings.event_ticket_platform
    ? String(settings.event_ticket_platform)
    : "";

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
 * Calculate minimum ticket price
 */
function getMinPrice(tickets: Array<{ price: string }>): number {
  let minPrice = 0;
  for (const [index, ticket] of tickets.entries()) {
    const price = Number.parseFloat(ticket.price);
    if (index === 0) {
      minPrice = price;
    } else if (price < minPrice) {
      minPrice = price;
    }
  }
  return minPrice > 0 && minPrice < 1 ? 1 : Math.floor(minPrice);
}

/**
 * Build ticket URL based on platform
 */
function getTicketUrl(
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
function getBrandData(
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

  const showBrandPanel = settings.show_brand_panel
    ? Number.parseInt(String(settings.show_brand_panel), 10) === 1
    : true;
  const brandTitle =
    !settings.brand_title || settings.brand_title === ""
      ? eventName
      : String(settings.brand_title);
  const brandSubtitle =
    !settings.brand_subtitle || settings.brand_subtitle === ""
      ? formattedDate
      : String(settings.brand_subtitle);

  return {
    show_brand_panel: showBrandPanel,
    brand_title: brandTitle,
    brand_subtitle: brandSubtitle,
    brand_background_color: String(
      settings.brand_background_color || "#DF2C48",
    ),
    brand_text_color: String(settings.brand_text_color || "#FFFFFF"),
    brand_image_url: brandImageUrl || getS3Url("default/odience.png"),
    brand_background_image_url: brandBackgroundImageUrl || "",
    brand_ad_image_url: brandAdImageUrl || "",
    brand_background_opacity: settings.brand_background_opacity
      ? Number.parseFloat(String(settings.brand_background_opacity))
      : 1,
    brand_logo_padding: settings.brand_logo_padding
      ? Number.parseFloat(String(settings.brand_logo_padding))
      : 0.4,
  };
}

/**
 * Build invitation message with placeholders replaced
 */
function getInvitationMessage(
  eventId: bigint,
  eventName: string,
  eventDate: number | null,
  eventDescription: string,
  orgName: string,
  groupId: bigint,
  settings: Record<string, unknown>,
  appUrl: string,
): string {
  const message = settings.event_invitation_message
    ? String(settings.event_invitation_message)
    : "";

  let dateFormatted = "";
  if (eventDate) {
    const dateObj = new Date(eventDate * 1000);
    dateFormatted = dateObj
      .toLocaleString("en-US", {
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
 * Get organization name (handle private groups)
 */
function getOrgName(groupName: string, ownerName: string | null): string {
  if (groupName.includes("PrivateGroup:[") && ownerName) {
    return ownerName;
  }
  return groupName;
}

/**
 * Filter settings to only include specific keys used by frontend
 */
function getFilteredSettings(
  settings: Record<string, unknown>,
): Record<string, unknown> {
  const SETTINGS_KEYS = [
    "event_feature_chat",
    "message_interval",
    "event_message_reminder",
    "event_end_reminder_interval",
    "time_limited_invitation",
    "videowall_request_invite_duration",
    "videowall_reaction_duration_interval",
    "videowall_call_resolution",
    "nft_bot",
    "hq_zoom",
    "automatic_sms_items",
    "maximum_stream_messages",
    "chat_profanity",
  ];

  const filtered: Record<string, unknown> = {};
  for (const key of SETTINGS_KEYS) {
    if (key in settings) {
      let value = settings[key];

      // Convert specific fields to boolean
      if (key === "event_feature_chat") {
        value = String(value) === "on";
      } else if (key === "hq_zoom") {
        value = Number.parseInt(String(value), 10) === 1;
      } else if (
        [
          "message_interval",
          "event_message_reminder",
          "event_end_reminder_interval",
          "videowall_request_invite_duration",
          "videowall_reaction_duration_interval",
          "maximum_stream_messages",
        ].includes(key)
      ) {
        value = Number.parseInt(String(value), 10);
      }

      filtered[key] = value;
    }
  }
  return filtered;
}

/**
 * Get sponsor settings from event settings
 */
function getSponsorSettings(
  settings: Record<string, unknown>,
): Record<string, Record<string, number>> {
  const sponsorSettings: Record<string, Record<string, number>> = {
    event_brand_panel: {
      ad_brand_panel_display_interval: Number.parseInt(
        String(settings.ad_brand_panel_display_interval ?? 10),
        10,
      ),
    },
    event_details: {
      ad_event_details_display_interval: Number.parseInt(
        String(settings.ad_event_details_display_interval ?? 10),
        10,
      ),
    },
    event_in_stream: {
      ad_inisde_stream_show_interval:
        Number.parseInt(
          String(settings.ad_inisde_stream_show_interval ?? 15),
          10,
        ) * 60,
      ad_inside_stream_display_delay: Number.parseInt(
        String(settings.ad_inside_stream_display_delay ?? 0),
        10,
      ),
      ad_inside_stream_skip_after: Number.parseInt(
        String(settings.ad_inside_stream_skip_after ?? 5),
        10,
      ),
    },
    event_invitation: {
      ad_invitation_page_display_interval: Number.parseInt(
        String(settings.ad_invitation_page_display_interval ?? 10),
        10,
      ),
    },
  };
  return sponsorSettings;
}

/**
 * Get host (assistant) phone number from settings or fallback to owner
 */
function getHost(
  settings: Record<string, unknown>,
  ownerMsisdn: string,
): string {
  const assistantPhone = settings.event_assistant_phone_number;
  return assistantPhone ? String(assistantPhone) : ownerMsisdn;
}

/**
 * Check if event has location lock enabled
 */
function getOnLocationLock(locationInfo: Prisma.JsonValue): boolean {
  const info = locationInfo as Record<string, unknown> | null;
  return !!info?.location_lock;
}

/**
 * Check if event has on-location feature enabled
 */
function getOnLocation(locationInfo: Prisma.JsonValue): boolean {
  const info = locationInfo as Record<string, unknown> | null;
  return Boolean(info?.on_location_feature ?? 0);
}

/**
 * Get number of users currently connected to an event from Redis
 */
async function getUsersConnected(eventId: bigint) {
  try {
    const key = `{event:${eventId}}:users:`;
    const usersConnected = await redis.hget(key, "users_connected_list");
    return usersConnected ? Number(usersConnected) : 0;
  } catch (error) {
    console.error(`Failed to get users connected for event ${eventId}:`, error);
    return 0;
  }
}
export async function getVisibleEvents(
  userInfo: {
    userId: number;
    msisdn: string;
    isSuperAdmin: boolean;
    emails: string[];
    orgIds: number[];
  },
  queryParams: EventQueryParams = {},
): Promise<listEventsResponseSchema> {
  const startTime = Date.now();
  const searchInitTimestamp = queryParams.date ?? 0;
  const searchLocation = queryParams.location ?? "";
  const searchCategory = queryParams.category ?? "";
  const searchEventId = queryParams.id ? BigInt(queryParams.id) : undefined;
  const isWebApi = queryParams.isWebApi ?? false;
  const clientIp = queryParams.clientIp ?? "";

  const dateStr = searchInitTimestamp
    ? new Date(searchInitTimestamp * 1000).toISOString().slice(0, 10)
    : null;

  // Build the main WHERE clause
  const whereConditions: Prisma.eventWhereInput = {
    is_draft: false,
    active: true,
    web_allowed: false, // Filter for events that are not web-allowed (mobile app events)
  };

  if (searchCategory) {
    whereConditions.category = searchCategory;
  }

  if (searchLocation) {
    whereConditions.location = { contains: searchLocation };
  }

  if (searchEventId) {
    whereConditions.id = searchEventId;
  }

  // Date and duration filters
  whereConditions.OR = [
    {
      AND: [
        {
          OR: [
            {
              AND: [
                { date: { not: null } },
                { duration: { not: null } },
                {
                  // (date + duration) >= dateNow
                  // This is complex - we'll use raw SQL via Prisma.sql if needed
                },
              ],
            },
            { duration: null },
          ],
        },
      ],
    },
  ];

  // Simplified date filter - Prisma doesn't support complex SQL expressions easily
  // We'll filter events where they haven't ended yet
  if (dateStr) {
    // Add date string filter - would need to use raw SQL for DATE(FROM_UNIXTIME(event.date))
    // For now, we'll filter in memory after fetching
  }

  // Events must have streams or simulations
  whereConditions.OR = [
    { event_stream: { some: {} } },
    { event_simulation: { some: {} } },
  ];

  // Public/private visibility logic
  if (isWebApi) {
    whereConditions.is_public = true;
  } else if (!userInfo.isSuperAdmin) {
    whereConditions.OR = [
      { is_public: true },
      {
        AND: [
          { is_public: false },
          {
            OR: [
              { owner_id: userInfo.userId },
              ...(userInfo.orgIds.length > 0
                ? [
                    {
                      group_id: { in: userInfo.orgIds.map((id) => BigInt(id)) },
                    },
                  ]
                : []),
              {
                invite: {
                  some: {
                    recipient: { in: [userInfo.msisdn, ...userInfo.emails] },
                  },
                },
              },
            ],
          },
        ],
      },
    ];
  }

  // STEP 1: Main query with minimal joins
  const startMain = Date.now();
  const events = await prisma.event.findMany({
    where: whereConditions,
    include: {
      group: true,
      // owner is not a direct relation - we'll need to fetch separately
    },
    orderBy: {
      date: "asc",
    },
  });

  console.log(
    `Main query: ${Date.now() - startMain}ms, Events: ${events.length}`,
  );

  if (events.length === 0) {
    return { total_events: 0, per_page: 0, current_page: 0, events: [] };
  }

  const eventIds = events.map((e) => e.id);

  // STEP 2: Load all other data in parallel
  const startParallel = Date.now();

  const [
    invites,
    streams,
    streamUrls,
    simulations,
    ads,
    settings,
    userRemovedData,
    userOpenedData,
    userRequestsData,
    userRegisteredData,
    userInterestedData,
    userBlockedData,
    shortUrls,
  ] = await Promise.all([
    // Invites
    prisma.invite.findMany({
      where: { event_id: { in: eventIds } },
      select: { event_id: true, recipient: true },
    }),

    // Streams
    prisma.event_stream.findMany({
      where: { event_id: { in: eventIds } },
      include: {
        stream: {
          select: { id: true, recorded_type: true, code: true },
        },
      },
    }),

    // Stream URLs
    prisma.stream_url.findMany({
      where: {
        stream: {
          event_stream: {
            some: {
              event_id: { in: eventIds },
            },
          },
        },
        download_url: { not: null },
      },
      select: {
        download_url: true,
        stream: {
          select: {
            event_stream: {
              where: { event_id: { in: eventIds } },
              select: { event_id: true },
            },
          },
        },
      },
    }),

    // Simulations
    prisma.event_simulation.findMany({
      where: { event_id: { in: eventIds } },
      select: { simulation_id: true, event_id: true },
    }),

    // Ads with sponsors
    prisma.ad_event
      .findMany({
        where: { event_id: { in: eventIds } },
        include: {
          ad: true,
        },
        orderBy: [{ event_id: "asc" }, { order: "asc" }],
      })
      .then(async (adEvents) => {
        const sponsorIds = adEvents
          .map((ae) => ae.ad.sponsor_id)
          .filter((id): id is number => id !== null);
        const sponsors = await prisma.sponsor.findMany({
          where: { id: { in: sponsorIds } },
          select: { id: true, name: true },
        });
        const sponsorMap = new Map(sponsors.map((s) => [s.id, s]));
        return adEvents.map((ae) => ({
          ...ae,
          sponsor: ae.ad.sponsor_id
            ? sponsorMap.get(BigInt(ae.ad.sponsor_id))
            : null,
        }));
      }),

    // Settings
    prisma.setting.findMany({
      where: {
        key: "event_settings",
        configurable_type: "App\\Models\\Event",
        configurable_id: { in: eventIds.map((id) => Number(id)) },
      },
      select: { id: true, key: true, value: true, configurable_id: true },
    }),

    // User relations
    prisma.event_removed.findMany({
      where: { event_id: { in: eventIds } },
      select: { event_id: true, msisdn: true },
    }),

    prisma.event_opened.findMany({
      where: { event_id: { in: eventIds } },
      select: { event_id: true, msisdn: true },
    }),

    prisma.event_requests.findMany({
      where: { event_id: { in: eventIds } },
      select: { event_id: true, msisdn: true },
    }),

    prisma.event_registered.findMany({
      where: { event_id: { in: eventIds } },
      select: { event_id: true, msisdn: true },
    }),

    prisma.event_interested.groupBy({
      by: ["event_id"],
      where: { event_id: { in: eventIds } },
      _count: { id: true },
    }),

    prisma.event_blocked.findMany({
      where: { event_id: { in: eventIds } },
      select: { event_id: true, msisdn: true },
    }),

    // Short URLs for event app codes
    prisma.short_url
      .findMany({
        where: {
          url: {
            // TODO: change this condition to match url better, maybe add search, or just add an event id to the table
            in: eventIds.map((id) => `${env.DIRECTOR_URL}/openOdience/${id}`),
          },
        },
        select: { url: true, key: true },
      })
      .then((shortUrls) =>
        shortUrls.map((shortUrl) => {
          const match = regex("/openOdience/(?<id>\\d+)").exec(shortUrl.url);
          const eventId = match?.groups?.id ? BigInt(match.groups.id) : null;
          return {
            ...shortUrl,
            eventId,
          };
        }),
      ),
  ]);
  console.log(`Parallel queries: ${Date.now() - startParallel}ms`);

  // STEP 3: Map data back to events
  const startMapping = Date.now();

  // Create lookup maps
  const invitesMap = new Map<bigint, Array<{ recipient: string }>>();
  for (const i of invites) {
    if (!i.event_id) continue;
    if (!invitesMap.has(i.event_id)) {
      invitesMap.set(i.event_id, []);
    }
    invitesMap.get(i.event_id)?.push({ recipient: i.recipient });
  }

  const streamsMap = new Map<
    bigint,
    Array<{ id: bigint; recordedType: number; code: string | null }>
  >();
  for (const s of streams) {
    if (!streamsMap.has(s.event_id)) streamsMap.set(s.event_id, []);
    streamsMap.get(s.event_id)?.push({
      id: s.stream.id,
      recordedType: s.stream.recorded_type,
      code: s.stream.code,
    });
  }

  const streamUrlsMap = new Map<bigint, Set<string>>();
  for (const su of streamUrls) {
    for (const es of su.stream.event_stream) {
      if (!streamUrlsMap.has(es.event_id)) {
        streamUrlsMap.set(es.event_id, new Set());
      }
      if (su.download_url) {
        streamUrlsMap.get(es.event_id)?.add(su.download_url);
      }
    }
  }

  const simulationsMap = new Map<bigint, Array<{ simulation_id: bigint }>>();
  for (const sim of simulations) {
    if (!simulationsMap.has(sim.event_id)) {
      simulationsMap.set(sim.event_id, []);
    }
    simulationsMap.get(sim.event_id)?.push({
      simulation_id: sim.simulation_id,
    });
  }

  const adsMap = new Map<bigint, Array<unknown>>();
  for (const ad of ads) {
    if (!adsMap.has(ad.event_id)) adsMap.set(ad.event_id, []);
    adsMap.get(ad.event_id)?.push({
      id: ad.ad.id,
      location: ad.ad.location,
      name: ad.ad.name,
      url: ad.ad.url,
      mediaUrl: ad.ad.media_url,
      order: ad.order,
      sponsor: ad.sponsor || null,
    });
  }

  const settingsMap = new Map<
    bigint,
    Array<{ id: bigint; key: string; value: string | null }>
  >();
  for (const s of settings) {
    if (s.configurable_id !== null) {
      settingsMap.set(BigInt(s.configurable_id), [
        {
          id: s.id,
          key: s.key,
          value: s.value,
        },
      ]);
    }
  }

  // User data maps
  const createUserMap = (
    data: Array<{ event_id: bigint; msisdn: string | null }>,
  ) => {
    const map = new Map<bigint, Array<{ msisdn: string }>>();
    for (const item of data) {
      if (!item.msisdn) continue;
      if (!map.has(item.event_id)) map.set(item.event_id, []);
      map.get(item.event_id)?.push({ msisdn: item.msisdn });
    }
    return map;
  };

  const removedMap = createUserMap(userRemovedData);
  const openedMap = createUserMap(userOpenedData);
  const requestsMap = createUserMap(userRequestsData);
  const registeredMap = createUserMap(userRegisteredData);
  const blockedMap = createUserMap(userBlockedData);

  const interestedMap = new Map<bigint, Array<{ id: number }>>();
  for (const d of userInterestedData) {
    interestedMap.set(d.event_id, Array(d._count.id).fill({ id: 0 }));
  }

  console.log(`Mapping: ${Date.now() - startMapping}ms`); // STEP 4: Transform events to match contract schema
  const transformedEvents = await Promise.all(
    events.map(async (event) => {
      const eventInvites = invitesMap.get(event.id) || [];
      const eventStreams = streamsMap.get(event.id) || [];
      const eventSettings = settingsMap.get(event.id) || [];

      // Calculate dynamic fields
      const usersConnected = await getUsersConnected(event.id);
      const invitationAccepted = await getInvitationAccepted(
        {
          id: event.id,
          location_info: event.location_info,
          invites: eventInvites,
        },
        userInfo,
        clientIp,
      );

      // Parse settings JSON
      let parsedSettings: Record<string, unknown> = {};
      if (eventSettings.length > 0 && eventSettings[0]?.value) {
        try {
          const parsed = JSON.parse(eventSettings[0].value);
          if (typeof parsed === "object" && parsed !== null) {
            parsedSettings = parsed as Record<string, unknown>;
          }
        } catch {
          parsedSettings = {};
        }
      }

      // Get ticket and brand info
      const { tickets, ticketPlatform } = getTicketSettings(parsedSettings);
      const minPrice = getMinPrice(tickets);
      const eventbriteUrl = parsedSettings.eventbrite_event_url
        ? String(parsedSettings.eventbrite_event_url)
        : "";
      const ticketUrl = getTicketUrl(
        event.id,
        event.payed,
        ticketPlatform,
        eventbriteUrl,
      );

      // Build organization name
      const orgName = getOrgName(event.group.name, null);

      const appCode = shortUrls.find(
        (shortUrl) => shortUrl.eventId === event.id,
      )?.key;
      const appUrl = `${env.DIRECTOR_URL}/o/${event.id}${appCode ? `/${appCode}` : ""}`;

      // Get brand data
      const brandData = getBrandData(
        event.name,
        event.date,
        event.brand_image_url,
        event.brand_background_image_url,
        event.brand_ad_image_url,
        parsedSettings,
      );

      // Get invitation message
      const invitationMessage = getInvitationMessage(
        event.id,
        event.name,
        event.date,
        event.description ?? "",
        orgName,
        event.group_id,
        parsedSettings,
        appUrl,
      );

      // Calculate event label
      const eventSimulations = simulationsMap.get(event.id) || [];
      const eventLabel = getEventLabel(
        event.date,
        event.duration,
        event.active,
        event.is_draft,
        eventStreams,
        eventSimulations.length > 0,
        event.restream,
      );

      // Get featured catalogue settings
      const imageAlignment = parsedSettings.eatured_catalog_image_alignment
        ? String(parsedSettings.eatured_catalog_image_alignment)
        : "scalefit";
      const blurredBackground =
        parsedSettings.featured_catalog_blurred_background
          ? Number.parseInt(
              String(parsedSettings.featured_catalog_blurred_background),
              10,
            ) === 1
          : false;

      // Check if event is complete (at capacity)
      const registeredCount = (registeredMap.get(event.id) || []).length;
      const isComplete = event.capacity
        ? registeredCount >= event.capacity
        : false;

      // Get owner user data for host
      const ownerUser = await prisma.user.findUnique({
        where: { id: event.owner_id },
        select: { msisdn: true },
      });
      const ownerMsisdn = ownerUser?.msisdn ?? "";
      const host = getHost(parsedSettings, ownerMsisdn);

      // Get location lock status
      const locationInfo = event.location_info;
      const onLocationLock = getOnLocationLock(locationInfo);
      const onLocation = getOnLocation(locationInfo);

      if (event.id === BigInt(14)) {
        console.log("Event14 locationInfo", locationInfo);
      }

      // Get external ads/sponsors
      const eventAds = adsMap.get(event.id) || [];

      // Transform to match RestEvent schema
      return {
        id: String(event.id),
        namespace: `/${event.id}`,
        name: event.name,
        label: eventLabel,
        duration: event.duration ?? -1,
        date: event.date ?? 0,
        featured: event.featured ?? false,
        location: event.location ?? "",
        brand: brandData,
        featured_catalogue: {
          image_alignment: imageAlignment,
          blurred_background: blurredBackground,
        },
        organization: orgName,
        organization_image_url: event.group.image_url ?? "",
        owner_id: String(event.owner_id),
        organization_id: String(event.group_id),
        description: event.description ?? "",
        category: event.category ?? "",
        categoryImage: event.category
          ? `${env.AWS_URL}/tags/${event.category}.png`
          : "",
        capacity: event.capacity ?? 0,
        coordinates: {
          lat: event.latitude ? Number(event.latitude) : 0,
          lng: event.longitude ? Number(event.longitude) : 0,
        },
        is_public: event.is_public,
        is_5g: event.is_5g ?? false,
        imageUrl: event.image_url ?? "",
        min_price: minPrice,
        ticket_url: ticketUrl,
        ticket_platform: ticketPlatform,
        map_image_url: `${env.DIRECTOR_URL}/mobile/mapImage/${event.id}?date=${Math.floor(Date.now() / 1000)}`,
        promo_video_url: event.promo_video_url ?? "",
        promo_video_aspect_ratio:
          event.promo_video_url && event.promo_video_aspect_ratio
            ? event.promo_video_aspect_ratio
            : "",
        has_ricoh_stream: eventStreams.some(
          (s) => s.code !== null && s.code.trim() !== "",
        ),
        payed: event.payed,
        invitation_message: invitationMessage,
        event_url: appUrl,
        invitations_only: event.invitations_only,
        usersConnected,
        complete: isComplete,
        invitation_accepted: invitationAccepted,
        invitation_requested: (requestsMap.get(event.id) || []).some(
          (r) => r.msisdn === userInfo.msisdn,
        ),
        registered: (registeredMap.get(event.id) || []).some(
          (r) => r.msisdn === userInfo.msisdn,
        ),
        usersInterestedCount: (interestedMap.get(event.id) || []).length,
        banned: (removedMap.get(event.id) || []).some(
          (r) => r.msisdn === userInfo.msisdn,
        ),
        blocked: (blockedMap.get(event.id) || []).some(
          (r) => r.msisdn === userInfo.msisdn,
        ),
        opened: (openedMap.get(event.id) || []).some(
          (r) => r.msisdn === userInfo.msisdn,
        ),
        pre_access:
          userInfo.isSuperAdmin ||
          event.owner_id === userInfo.userId ||
          userInfo.orgIds.includes(Number(event.group_id)),
        web_allowed: event.web_allowed ? 1 : 0,
        app_allowed: event.app_allowed ? 1 : 0,
        appUrl: appUrl,
        settings: getFilteredSettings(parsedSettings),
        active: event.active,
        downloads: streamUrlsMap.has(event.id)
          ? Array.from(streamUrlsMap.get(event.id) ?? new Set<string>())
          : [],
        sponsors: {
          custom: {},
          settings: getSponsorSettings(parsedSettings),
          external: eventAds,
        },
        host,
        onLocation,
        onLocationLock,
        streams: [],
      };
    }),
  );

  console.log(
    `${Date.now() - startTime}ms time took to get events list for user ${userInfo.msisdn}`,
  );

  return {
    total_events: transformedEvents.length,
    per_page: 20,
    current_page: 1,
    events: transformedEvents,
  };
}

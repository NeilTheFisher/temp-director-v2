/**
 * Convert IP to long
 */
export function ipToLong(ip: string): number {
  return (
    ip
      .split(".")
      .reduce((acc, octet) => (acc << 8) + Number.parseInt(octet, 10), 0) >>> 0
  );
}

/**
 * Check if IP is in CIDR range
 */
export function isIpInCidr(ip: string, cidr: string): boolean {
  const parts = cidr.split("/");
  const range = parts[0] || "";
  const bits = parts[1] || "32";
  const maskBits = Number.parseInt(bits, 10);

  const ipNum = ipToLong(ip);
  const rangeNum = ipToLong(range);

  const mask = maskBits === 0 ? 0 : (~0 << (32 - maskBits)) >>> 0;

  return (ipNum & mask) === (rangeNum & mask);
}

/**
 * Check IP is allowed based on location restrictions
 */
export function isIpAllowed(allowedIps: string | string[], clientIp: string) {
  if (!clientIp) return false;

  const ips = Array.isArray(allowedIps)
    ? allowedIps
    : allowedIps
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

  return ips.some((cidr) => {
    if (!cidr) return false;
    return isIpInCidr(clientIp, cidr);
  });
}

/**
 * Calculate distance between two lat/lng points in meters
 * Uses Haversine formula
 */
export function calculateDistance(
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
 * Calculate event status label based on current state
 */
export function getEventLabel(
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
 * Calculate minimum ticket price
 */
export function getMinPrice(tickets: Array<{ price: string }>): number {
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

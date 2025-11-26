import { redis } from "bun";

/**
 * Redis utilities using Bun's native redis
 * PNS settings are stored in Redis under pns_settings:{userId}
 */

/**
 * Get PNS settings for a user from Redis
 */
export async function getPnsSettings(userId: number): Promise<{
  pns_event_created: boolean;
  pns_event_updated: boolean;
  pns_event_registered: boolean;
  pns_event_mention: boolean;
}> {
  const cacheKey = `pns_settings:${userId}`;

  try {
    const cachedSettings = await redis.get(cacheKey);
    if (cachedSettings) {
      const parsed = JSON.parse(cachedSettings);
      return parsed as {
        pns_event_created: boolean;
        pns_event_updated: boolean;
        pns_event_registered: boolean;
        pns_event_mention: boolean;
      };
    }
  } catch (error) {
    console.error("Error fetching PNS settings from Redis:", error);
  }

  // Return default settings if not found in Redis
  return {
    pns_event_created: true,
    pns_event_updated: true,
    pns_event_registered: true,
    pns_event_mention: true,
  };
}

/**
 * Set PNS settings for a user in Redis
 */
export async function setPnsSettings(
  userId: number,
  settings: {
    pns_event_created: boolean;
    pns_event_updated: boolean;
    pns_event_registered: boolean;
    pns_event_mention: boolean;
  },
): Promise<void> {
  const cacheKey = `pns_settings:${userId}`;

  try {
    // Set with 24-hour expiration
    await redis.setex(cacheKey, 86400, JSON.stringify(settings));
  } catch (error) {
    console.error("Error setting PNS settings in Redis:", error);
  }
}

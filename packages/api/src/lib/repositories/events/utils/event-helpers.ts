import type { UserEventInfo } from "../../user";
import type { Prisma } from "@director_v2/db/prisma/generated/client";

/**
 * Check if user has an invitation to an event
 */
export function hasUserInvite(
  invites: Array<{ recipient: string }>,
  userInfo: UserEventInfo
): boolean {
  const recipients = new Set(invites.map((i) => i.recipient));
  if (recipients.has(userInfo.msisdn)) return true;
  return userInfo.emails.some((email) => recipients.has(email));
}

/**
 * Get organization name (handle private groups)
 */
export function getOrgName(groupName: string, ownerName: string | null): string {
  if (groupName.includes("PrivateGroup:[") && ownerName) {
    return ownerName;
  }
  return groupName;
}

/**
 * Check if event has location lock enabled
 */
export function getOnLocationLock(locationInfo: Prisma.JsonValue): boolean {
  const info = locationInfo as Record<string, unknown> | null;
  return !!info?.location_lock;
}

/**
 * Check if event has on-location feature enabled
 */
export function getOnLocation(locationInfo: Prisma.JsonValue): boolean {
  const info = locationInfo as Record<string, unknown> | null;
  return Boolean(info?.on_location_feature ?? 0);
}

/**
 * Get host (assistant) phone number from settings or fallback to owner
 */
export function getHost(settings: Record<string, unknown>, ownerMsisdn: string): string {
  const assistantPhone = settings.event_assistant_phone_number;
  if (assistantPhone && typeof assistantPhone === "string") {
    return assistantPhone;
  }
  return ownerMsisdn;
}

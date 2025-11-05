import prisma from "@director_v2/db";

/**
 * Event Repository
 * Handles all event-related database queries.
 */

export async function getEventById(id: bigint) {
  return prisma.event.findUnique({
    where: { id },
    include: {
      group: true,
      invite: true,
    },
  });
}

export async function getEventsByGroup(groupId: bigint) {
  return prisma.event.findMany({
    where: {
      group_id: groupId,
      is_draft: false,
    },
    include: {
      group: true,
      invite: true,
    },
    orderBy: {
      date: "desc",
    },
  });
}

/**
 * Get all non-draft events visible to a user based on:
 * - Public events
 * - Events owned by the user
 * - Events in organizations the user belongs to
 * - Private events where the user is invited
 */
export async function getVisibleEvents(
  userId: number,
  orgIds: number[],
  msisdn: string,
  emails: string[],
  isSuperAdmin: boolean,
) {
  // Super admins can see everything
  if (isSuperAdmin) {
    return prisma.event.findMany({
      where: {
        is_draft: false,
      },
      include: {
        group: true,
        invite: true,
      },
      orderBy: {
        date: "desc",
      },
    });
  }

  // Regular users: public events + owned events + org events + invited events
  return prisma.event.findMany({
    where: {
      is_draft: false,
      OR: [
        // Public events
        { is_public: true },
        // Events owned by the user
        { owner_id: userId },
        // Events in user's organizations
        { group_id: { in: orgIds } },
        // Private events where user is invited
        {
          AND: [
            {
              invite: {
                some: {
                  OR: [{ recipient: msisdn }, { recipient: { in: emails } }],
                },
              },
            },
            { is_public: false },
          ],
        },
      ],
    },
    include: {
      group: true,
      invite: true,
    },
    orderBy: {
      date: "desc",
    },
  });
}

/**
 * Get event status label based on dates and configuration
 * Returns one of: draft, ended, upcoming, active
 */
export function getEventStatus(event: {
  active: boolean;
  is_draft: boolean;
  date: number | null;
  duration: number | null;
}): string {
  if (!event.active) return "deactivated";
  if (event.is_draft) return "draft";

  const now = Math.floor(Date.now() / 1000);

  // Check if event has ended
  if (event.duration && event.date && event.date + event.duration <= now) {
    return "ended";
  }

  // Check if event is currently happening
  if (
    event.date &&
    event.date <= now &&
    (!event.duration || event.date + event.duration > now)
  ) {
    return "active";
  }

  // Check if event is upcoming
  if (event.date && event.date > now) {
    return "upcoming";
  }

  return "deactivated";
}

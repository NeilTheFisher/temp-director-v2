import prisma from "@director_v2/db";

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
    orderBy: {
      date: "desc",
    },
  });
}

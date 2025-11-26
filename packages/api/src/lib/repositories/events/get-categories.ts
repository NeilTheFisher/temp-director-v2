import prisma from "@director_v2/db";
import type { Prisma } from "@director_v2/db/prisma/generated/client";
import type { UserEventInfo } from "../user";
import { getS3Url } from "./utils/event-builders";

/**
 * Get all distinct event categories visible to the user
 * Based on event permissions and active/draft status
 */
export async function getCategories(
  userInfo: UserEventInfo,
): Promise<Array<{ category: string; image: string }>> {
  try {
    const dateNow = Math.floor(Date.now() / 1000);

    // Build permission filters
    const permissionFilter: Prisma.eventWhereInput = userInfo.isSuperAdmin
      ? {}
      : {
          OR: [
            // Public events
            { is_public: true },
            // Private events where user has access
            {
              AND: [
                { is_public: false },
                {
                  OR: [
                    // User is owner
                    { owner_id: userInfo.userId },
                    // User is in organization
                    ...(userInfo.orgIds.length > 0
                      ? [{ group_id: { in: userInfo.orgIds } }]
                      : []),
                    // User is invited
                    {
                      invite: {
                        some: {
                          recipient: {
                            in: [userInfo.msisdn, ...userInfo.emails],
                          },
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        };

    // Query for distinct categories
    const categories = await prisma.event.findMany({
      distinct: ["category"],
      where: {
        is_draft: false,
        active: true,
        // Event must have active stream or simulation
        OR: [
          { event_stream: { some: {} } },
          { event_simulation: { some: {} } },
        ],
        // Date filtering - event must not have ended
        AND: [
          {
            OR: [
              {
                date: {
                  gte: dateNow,
                },
              },
              {
                duration: null,
              },
            ],
          },
        ],
        // Permission filtering
        ...permissionFilter,
      },
      select: {
        category: true,
      },
    });

    return categories
      .filter((c) => c.category !== null && c.category !== "")
      .map((c) => ({
        category: c.category || "",
        image: getS3Url(`tags/${c.category}.png`),
      }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

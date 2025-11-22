import prisma from "@director_v2/db";

/**
 * User Repository
 * Handles all user-related database queries.
 */

export async function getUserById(id: bigint) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      email_user: true,
    },
  });
}

/**
 * Get user info for event filtering
 * Returns: { userId, msisdn, isSuperAdmin, emails, orgIds }
 * This is used to determine which events a user can see
 */
export async function getUserInfoForEvents(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      email_user: true,
      roles_user_group: {
        include: {
          roles: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  // Collect all emails
  const userEmails: string[] = [];
  if (user.email) {
    userEmails.push(user.email);
  }
  if (user.email_user && user.email_user.length > 0) {
    user.email_user.forEach((emailRecord: { email: string }) => {
      userEmails.push(emailRecord.email);
    });
  }

  // Determine super admin status and collect org IDs from user's roles
  let isSuperAdmin = false;
  const orgIds: number[] = [];

  if (user.roles_user_group && user.roles_user_group.length > 0) {
    user.roles_user_group.forEach((userRole) => {
      const roleName = userRole.roles?.name || "";

      // Check if SUPER_ADMIN role (common patterns: "super-admin", "Super Admin", "SUPER_ADMIN")
      if (
        roleName.toLowerCase().includes("super") &&
        roleName.toLowerCase().includes("admin")
      ) {
        isSuperAdmin = true;
      }

      // Collect group IDs (organizations) where user has a role
      // Skip if user is super admin (they see everything)
      if (userRole.group_id !== null && !isSuperAdmin) {
        const groupId = Number(userRole.group_id);
        if (!orgIds.includes(groupId)) {
          orgIds.push(groupId);
        }
      }
    });

    // If user is super admin, clear org IDs (super admins see everything)
    if (isSuperAdmin) {
      orgIds.length = 0;
    }
  }

  return {
    userId: Number(user.id),
    msisdn: user.msisdn || "",
    isSuperAdmin,
    emails: [...new Set(userEmails)],
    orgIds: [...new Set(orgIds)],
  };
}

export type UserEventInfo = NonNullable<
  Awaited<ReturnType<typeof getUserInfoForEvents>>
>;

/**
 * Get full user info including relationships
 */
export async function getFullUserInfo(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      email_user: true,
    },
  });

  if (!user) {
    return null;
  }

  // Collect emails
  const userEmails: string[] = [];
  if (user.email) {
    userEmails.push(user.email);
  }
  if (user.email_user && user.email_user.length > 0) {
    user.email_user.forEach((emailRecord: { email: string }) => {
      userEmails.push(emailRecord.email);
    });
  }

  return {
    user_id: Number(user.id),
    msisdn: user.msisdn,
    email: user.email,
    emails: [...new Set(userEmails)],
    name: user.name,
    avatar: user.avatar_url,
    account_type: user.account_type,
  };
}

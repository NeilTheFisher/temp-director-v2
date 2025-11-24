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
 * Mirrors director-api UserService.getUserInfo
 */
export async function getFullUserInfo(userId: number) {
  const reportedUsers: string[] = [];
  let boolSuperAdmin = false;
  const orgRoles: { [key: number]: string[] } = {};

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        users_reported_by_users: true,
        users_blocked_by_users: true,
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

    // Get reported users
    const reportedUsersObjects = user.users_reported_by_users || [];
    reportedUsers.push(...reportedUsersObjects.map((ru) => ru.reported));

    // Get blocked users with full details
    const blockedUsersObjects = user.users_blocked_by_users || [];
    const blockedUsers = await Promise.all(
      blockedUsersObjects.map(async (blocked) => {
        const userBlocked = await prisma.user.findUnique({
          where: { msisdn: blocked.blocked },
        });
        return userBlocked
          ? {
              id: userBlocked.msisdn || "",
              name: userBlocked.name,
              avatar: userBlocked.avatar_url,
              sip: `+${userBlocked.msisdn}`,
              type: "user",
            }
          : null;
      }),
    );

    // Get users who blocked this user
    const blockedByUsers = await prisma.users_blocked_by_users.findMany({
      where: { blocked: user.msisdn || "" },
      include: {
        user: true,
      },
    });

    // Collect emails
    const userEmails: string[] = [];
    if (user.email_user && user.email_user.length > 0) {
      user.email_user.forEach((emailRecord: { email: string }) => {
        userEmails.push(emailRecord.email);
      });
    }

    // Get user roles with org id
    const userRolesObject = user.roles_user_group || [];
    const userRoles = await Promise.all(
      userRolesObject.map(async (userRole) => {
        return userRole.roles
          ? { groupId: userRole.group_id, name: userRole.roles.name }
          : null;
      }),
    );

    userRoles.forEach((groupRole) => {
      if (boolSuperAdmin || !groupRole) {
        return;
      }
      if (groupRole.name === "ROLE_SUPER_ADMIN") {
        boolSuperAdmin = true;
        for (const key in orgRoles) {
          delete orgRoles[Number(key)];
        }
        return;
      }
      if (groupRole.groupId === null) {
        return;
      }
      const groupId = Number(groupRole.groupId);
      if (!orgRoles[groupId]) {
        orgRoles[groupId] = [];
      }
      orgRoles[groupId].push(groupRole.name);
    });

    return {
      user_id: Number(user.id),
      group_id: user.personal_group_id,
      name: user.name,
      email: user.email ?? "",
      emails: userEmails,
      avatar: user.avatar_url,
      msisdn: user.msisdn,
      image_uid: user.image_uid,
      account_type: Number(user.account_type),
      pns_settings: {
        // TODO: These values are currently saved in Redis in director-api
        // For now, return default values
        pns_event_created: true,
        pns_event_updated: true,
        pns_event_registered: true,
        pns_event_mention: true,
      },
      usersReported: reportedUsers,
      usersBlocked: blockedUsers.filter((u) => u !== null),
      usersBlockedBy: blockedByUsers.map((b) => b.user.msisdn),
      roles: {
        super_admin: boolSuperAdmin,
        organizations: orgRoles,
      },
    };
  } catch (error) {
    console.error("Error in getFullUserInfo:", error);
    return null;
  }
}

/**
 * Get user info by MSISDN
 * Mirrors director-api UserService.getUserInfoByMsisdn
 */
export async function getUserInfoByMsisdn(msisdn: string) {
  const user = await prisma.user.findUnique({
    where: { msisdn: msisdn },
  });

  return !user
    ? null
    : {
        id: String(msisdn),
        name: String(user.name),
        avatar: String(user.avatar_url),
        type: "standard",
        role: "user",
        sip: `+${msisdn}`,
      };
}

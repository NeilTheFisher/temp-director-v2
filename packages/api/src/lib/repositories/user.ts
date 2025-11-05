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

  // TODO: Check for super admin role and collect org IDs
  // This requires loading role information which needs more DB queries
  // For now, we return basic structure
  const isSuperAdmin = false;
  const orgIds: bigint[] = [];

  return {
    userId: Number(user.id),
    msisdn: user.msisdn || "",
    isSuperAdmin,
    emails: [...new Set(userEmails)],
    orgIds: [...new Set(orgIds)],
  };
}

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

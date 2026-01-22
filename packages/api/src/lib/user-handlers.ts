/**
 * User Handlers
 * Business logic for fetching and processing user data.
 */

import { ORPCError } from "@orpc/server";

import * as userRepository from "./repositories/user";

/**
 * Get user info for event filtering
 * Throws UNAUTHORIZED if user not found
 * Returns user ID, phone, super admin status, emails, and org memberships
 */
export async function getUserInfoForEvents(userId: number) {
  try {
    const userInfo = await userRepository.getUserInfoForEvents(userId);

    if (!userInfo) {
      throw new ORPCError("UNAUTHORIZED", {
        message: "User not found or not authenticated",
      });
    }

    return userInfo;
  } catch (error) {
    if (error instanceof ORPCError) {
      throw error;
    }
    console.error("[UserHandler] Error fetching user info:", error);
    throw new ORPCError("INTERNAL_SERVER_ERROR", {
      message: "Failed to fetch user info",
    });
  }
}

/**
 * Get complete user profile information
 * Throws UNAUTHORIZED if user not found
 */
export async function getFullUserInfo(userId: number) {
  try {
    const userInfo = await userRepository.getFullUserInfo(userId);

    if (!userInfo) {
      throw new ORPCError("UNAUTHORIZED", {
        message: "User not found",
      });
    }

    return userInfo;
  } catch (error) {
    if (error instanceof ORPCError) {
      throw error;
    }
    console.error("[UserHandler] Error fetching full user info:", error);
    throw new ORPCError("INTERNAL_SERVER_ERROR", {
      message: "Failed to fetch user profile",
    });
  }
}

import { env } from "@director_v2/config";
import prisma from "@director_v2/db";

/**
 * Stream Repository
 * Handles all stream-related database queries.
 * Mirrors director-api StreamUrlService
 */

/**
 * Get stream URLs by streamUrlId
 * Simplified version - edge discovery logic not yet implemented
 * TODO: Implement full edge discovery logic from director-api
 */
export async function getStreamUrls(
  streamUrlId: number,
  userId: number,
  clientIp: string,
) {
  console.log({ streamUrlId, userId, clientIp });
  const finalUrls: string[] = [];
  let error = "";

  try {
    // Fetch the stream URL with its related stream
    const streamUrl = await prisma.stream_url.findUnique({
      where: { id: streamUrlId },
      include: {
        stream: true,
      },
    });

    if (!streamUrl) {
      error = "stream URL not found";
      return { urls: [], error };
    }

    // Fetch the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      error = "user not found";
      return { urls: [], error };
    }

    if (user.type === "user") {
      // Generate token for user (6 hex chars from userId)
      const token = concatenateAndConvertToHex(6, String(userId));

      // TODO: Implement edge discovery logic
      // For now, use the base URL with token
      const baseUrl = streamUrl.url;
      let url = `${baseUrl}?key=${token}&userId=${userId}`;

      // Check for existing token in database
      const existingToken = await prisma.stream_url_token.findFirst({
        where: {
          user_id: userId,
          url: {
            contains: url,
          },
        },
        orderBy: {
          date: "desc",
        },
      });

      const EXPIRATION_INTERVAL = 300; // 5 minutes in seconds

      if (existingToken) {
        const isExpired =
          Date.now() / 1000 - Number(existingToken.date) >= EXPIRATION_INTERVAL;
        if (!isExpired) {
          url = existingToken.url;
        } else {
          // Remove expired token
          await prisma.stream_url_token.delete({
            where: { id: existingToken.id },
          });
          // Create new token
          await prisma.stream_url_token.create({
            data: {
              url: url,
              token: token,
              date: BigInt(Math.floor(Date.now() / 1000)),
              user_id: userId,
            },
          });
        }
      } else {
        // Create new token
        await prisma.stream_url_token.create({
          data: {
            url: url,
            token: token,
            date: BigInt(Math.floor(Date.now() / 1000)),
            user_id: userId,
          },
        });
      }

      // Add domain parameter (using DIRECTOR_URL as fallback)
      const domain = env.DIRECTOR_URL ?? "";
      finalUrls.push(`${url}&domain=${domain}`);
    } else {
      // Not a user, use default URL
      finalUrls.push(streamUrl.url);
    }
  } catch (err: unknown) {
    console.error(err);
    error = err instanceof Error ? err.message : "Unknown error";
  }

  return {
    urls: finalUrls,
    error: error,
  };
}

/**
 * Helper function to generate hex token from userId
 * Mirrors director-api concatenateAndConvertToHex utility
 */
function concatenateAndConvertToHex(length: number, value: string): string {
  // Pad the value to the desired length
  const paddedValue = value.padStart(length, "0");
  // Convert to hex
  let hex = "";
  for (let i = 0; i < paddedValue.length; i++) {
    hex += paddedValue.charCodeAt(i).toString(16);
  }
  return hex.substring(0, length * 2);
}

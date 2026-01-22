import { env } from "@director_v2/config";
import prisma from "@director_v2/db";

import { getAggregatorUrls } from "../services/awsAuthorizationService";
import { getMobileUserInfo } from "../services/geoipService";
import { getMccMncRulesUrl } from "../services/mccMncService";
import {
  concatenateAndConvertToHex,
  getPhoneDetails,
  parseDomainDetails,
} from "../utilities/streamUtils";

/**
 * Stream Repository
 * Handles all stream-related database queries.
 */

/**
 * Get stream URLs by streamUrlId with full edge discovery
 */
export async function getStreamUrls(
  streamUrlId: number,
  userId: number,
  clientIp: string,
  maxResults = 10
) {
  console.log({ streamUrlId, userId, clientIp, maxResults });
  const urlsWithTokens: Array<{ url: string; description: string }> = [];
  const finalUrls: string[] = [];
  let mcc = 0;
  let mnc = 0;
  let error = "";
  let city = "N/A";

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
      const urls: Array<{ url: string; description: string }> = [];
      const currentDomain = parseDomainDetails(streamUrl.url).currentDomain;
      console.log("currentDomain", currentDomain);

      // Check if edge discovery is enabled for this stream
      const edgeDiscoverySetting = await prisma.setting.findFirst({
        where: {
          key: "edge_discovery_enabled",
          configurable_type: "stream",
          configurable_id: streamUrlId,
        },
      });

      // Default to true if setting not found
      const edgeDiscoveryEnabled = edgeDiscoverySetting?.value !== "false";

      if (edgeDiscoveryEnabled) {
        const phoneDetails = getPhoneDetails(user.msisdn || "");
        const countryCode = phoneDetails?.countryCode || 0;
        const phoneIso = phoneDetails?.regionCode || "CA";

        if (clientIp) {
          const mobileUser = await getMobileUserInfo(clientIp);
          console.log("mobileUser", mobileUser);
          error = mobileUser.error;
          mcc = mobileUser.mcc;
          mnc = mobileUser.mnc;
          city = mobileUser.city;
        }

        const mccMncUrl = await getMccMncRulesUrl(
          mcc,
          mnc,
          user.msisdn || "",
          city,
          countryCode,
          phoneIso
        );
        console.log("mccMncUrl", mccMncUrl);
        const mccMncDomain = mccMncUrl.url;
        const description = mccMncUrl.description;

        if (mccMncDomain) {
          urls.push({
            url: streamUrl.url.replace(currentDomain, mccMncDomain),
            description: description,
          });
        } else if (clientIp && !mccMncDomain) {
          // Try to get aggregator URLs from Proteus
          const proteusId = env.PROTEUS_IAM_ACCESS_KEY_ID;
          const proteusKey = env.PROTEUS_IAM_SECRET_ACCESS_KEY;
          if (proteusId && proteusKey) {
            const proteusResult = await getAggregatorUrls(clientIp, maxResults);
            Object.values(proteusResult.urls).forEach(
              (result: { url: string; description: string }) => {
                urls.push({
                  url: streamUrl.url.replace(currentDomain, result.url),
                  description: result.description,
                });
              }
            );
          }
        }

        if (urls.length === 0) {
          urls.push({
            url: mccMncDomain ? streamUrl.url.replace(currentDomain, mccMncDomain) : streamUrl.url,
            description: "Edge discovery not possible or yielded no URLs",
          });
        }
      } else {
        urls.push({
          url: streamUrl.url,
          description: "Edge discovery for the stream is off",
        });
      }

      console.log("urls", urls);

      // Process URLs and create tokens
      for (const urlObject of urls) {
        let url = `${urlObject.url}?key=${token}&userId=${userId}`;
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
          const isExpired = Date.now() / 1000 - Number(existingToken.date) >= EXPIRATION_INTERVAL;
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

        urlsWithTokens.push({ url: url, description: urlObject.description });
      }

      // Create discovery log (for reference)
      const _descriptions: string[] = [];
      console.log("urlsWithTokens: ", urlsWithTokens);

      for (const urlWithToken of urlsWithTokens) {
        _descriptions.push(urlWithToken.description);
      }

      // Create discovery log
      const joinedStreamUrls = urlsWithTokens.map((u) => u.url).join(",");
      const streamUrlTruncated =
        joinedStreamUrls.length > 190 ? joinedStreamUrls.slice(0, 190) : joinedStreamUrls;

      await prisma.discovery_logs.create({
        data: {
          msisdn: user.msisdn || "",
          ip: clientIp || "",
          stream_url: streamUrlTruncated,
          mcc: mcc || null,
          mnc: mnc || null,
          country: "",
          mobile: !(mcc === 0 && mnc === 0),
          timestamp: Math.floor(Date.now() / 1000),
          description: error
            ? `live: ${streamUrl.stream.recorded_type === 0 ? "true" : "false"} error: ${error}`
            : _descriptions.join(","),
        },
      });
    } else {
      // Not a user, use default URL
      urlsWithTokens.push({
        url: streamUrl.url,
        description: "Not a user, use default URL",
      });
    }
  } catch (err: unknown) {
    console.error(err);
    error = err instanceof Error ? err.message : "Unknown error";
  }

  // Add domain parameter to final URLs
  const domain = env.DIRECTOR_URL ?? "";
  for (const streamUrl of urlsWithTokens) {
    finalUrls.push(`${streamUrl.url}&domain=${domain}`);
  }

  return {
    urls: finalUrls,
    error: error,
  };
}

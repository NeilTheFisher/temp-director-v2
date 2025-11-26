/**
 * AWS Authorization Service
 * Fetches aggregator URLs from Proteus IAM service for streaming
 */

import { createHash, createHmac } from "node:crypto";
import { resolve } from "node:dns/promises";
import {
  DescribeAvailabilityZonesCommand,
  EC2Client,
} from "@aws-sdk/client-ec2";
import { env } from "@director_v2/config";
import { redis } from "bun";

interface AggregatorUrl {
  url: string;
  description: string;
}

interface ZoneResponse {
  zones?: Array<{
    zoneIds?: string[];
    regionName?: string;
    zoneType?: string;
  }>;
}

/**
 * Get aggregator URLs from Proteus IAM service
 */
export async function getAggregatorUrls(
  ip: string,
  maxResults = 10,
): Promise<{ urls: Record<number, AggregatorUrl> }> {
  const proteusId = env.PROTEUS_IAM_ACCESS_KEY_ID;
  const proteusKey = env.PROTEUS_IAM_SECRET_ACCESS_KEY;

  if (!proteusId || !proteusKey) {
    console.warn("Proteus IAM credentials not configured");
    return { urls: {} };
  }

  const cacheKey = "aggregatorUrls";
  const cacheTTL = 15 * 60; // 15 minutes in seconds

  try {
    // Check cache first
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log("Cache hit for aggregator URLs");
      return JSON.parse(cachedData) as { urls: Record<number, AggregatorUrl> };
    }
    console.log("Cache miss for aggregator URLs");

    const region = process.env.PROTEUS_IAM_DEFAULT_REGION || "us-east-1";
    const service = process.env.PROTEUS_SERVICE || "proteus-preprod";
    const host =
      process.env.PROTEUS_HOST ||
      "discovery.us-east-1.gamma.proteus.ec2.aws.dev";
    const uri = process.env.PROTEUS_URI || "/discover-zones";

    // Get authorization header with AWS SigV4 signing
    const authorizationHeader = getAuthorizationHeader(
      ip,
      proteusId,
      proteusKey,
      region,
      service,
      host,
      uri,
    );

    const rawDate = new Date().toISOString();
    const amzDate = rawDate.replace(/[:-]|\.\d{3}/g, "");
    const url = `https://${host}${uri}`;

    const headers = {
      "Accept-Encoding": "identity",
      "User-Agent":
        "aws-cli/2.2.35 Python/3.8.8 Linux/5.12.14-200.fc33.x86_64 exe/x86_64.fedora.33 prompt/off command/proteus.discover-zones",
      "X-Amz-Date": amzDate,
      Authorization: authorizationHeader,
    };

    // Send the HTTP request
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ clientIp: ip }),
      signal: AbortSignal.timeout(10000),
    });

    // Process the response
    const responseData = (await response.json()) as ZoneResponse;
    const data = await getAvailableZoneUrls(responseData, maxResults);
    await redis.setex(cacheKey, cacheTTL, JSON.stringify(data));
    return data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Error fetching aggregator URLs:", message);
    return { urls: {} };
  }
}

/**
 * Generate AWS SigV4 authorization header
 */
function getAuthorizationHeader(
  ip: string,
  awsAccessKeyId: string,
  awsSecretAccessKey: string,
  region: string,
  service: string,
  host: string,
  uri: string,
): string {
  const algorithm = "AWS4-HMAC-SHA256";
  const method = "POST";
  const canonicalQueryString = "";

  // Generate timestamps
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, ""); // e.g., 20250127T123456Z
  const dateStamp = amzDate.slice(0, 8); // e.g., 20250127

  // Prepare payload
  const payloadString = JSON.stringify({ clientIp: ip });
  const hashedPayload = createHash("sha256")
    .update(payloadString)
    .digest("hex");

  // Prepare canonical request
  const canonicalHeaders = `host:${host}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = "host;x-amz-date";
  const canonicalRequest = [
    method,
    uri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    hashedPayload,
  ].join("\n");

  // Scope
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;

  // String to sign
  const stringToSign = [
    algorithm,
    amzDate,
    credentialScope,
    createHash("sha256").update(canonicalRequest).digest("hex"),
  ].join("\n");

  // Calculate signature
  const kSecret = `AWS4${awsSecretAccessKey}`;
  const kDate = createHmac("sha256", kSecret).update(dateStamp).digest();
  const kRegion = createHmac("sha256", kDate).update(region).digest();
  const kService = createHmac("sha256", kRegion).update(service).digest();
  const kSigning = createHmac("sha256", kService)
    .update("aws4_request")
    .digest();
  const signature = createHmac("sha256", kSigning)
    .update(stringToSign)
    .digest("hex");

  // Authorization header
  return `${algorithm} Credential=${awsAccessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
}

/**
 * Process Proteus response and extract available zone URLs
 */
async function getAvailableZoneUrls(
  response: ZoneResponse,
  maxResults: number,
): Promise<{ urls: Record<number, AggregatorUrl> }> {
  const results: AggregatorUrl[] = [];
  const directorSocketAddress = process.env.DIRECTOR_PUBLIC_IP || "default-ip";

  try {
    if (response && Array.isArray(response.zones)) {
      for (const zone of response.zones) {
        if (results.length >= maxResults) break;

        const zoneIds = zone.zoneIds || [];
        const zoneRegion = zone.regionName || "DEFAULT_REGION";
        const zoneType = zone.zoneType || "";

        if (
          zoneType === "availability-zone" ||
          zoneType === "wavelength-zone"
        ) {
          for (const zoneId of zoneIds) {
            if (results.length >= maxResults) break;

            const zoneName = await getAvailabilityZonesNameById(
              zoneRegion,
              zoneId,
              zoneType,
            );
            if (zoneName) {
              const urlEnding = directorSocketAddress.includes("eu")
                ? "de"
                : "org";
              const recordName = `agg.${zoneName}.odience.${urlEnding}`;

              try {
                const dnsRecords = await resolve(recordName);
                if (dnsRecords.length > 0) {
                  const url = `agg.${zoneName}.odience.${urlEnding}`;
                  const description = `Proteus rule was matched with the zone name: ${zoneName}`;
                  results.push({ url, description });
                }
              } catch (dnsError: unknown) {
                const dnsMessage =
                  dnsError instanceof Error
                    ? dnsError.message
                    : "Unknown DNS error";
                console.warn(
                  `DNS resolution failed for ${recordName}: ${dnsMessage}`,
                );
              }
            }
          }
        }
      }
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Error in getAvailableZoneUrls:", message);
  }

  // Convert array to Record with numeric keys
  const urlsRecord: Record<number, AggregatorUrl> = {};
  results.forEach((url, index) => {
    urlsRecord[index] = url;
  });

  return { urls: urlsRecord };
}

/**
 * Get availability zone name by ID, with caching
 */
async function getAvailabilityZonesNameById(
  region: string,
  zoneId: string,
  zoneType: string,
): Promise<string> {
  const cacheTTL = 60 * 60; // 1 hour in seconds
  const cacheKey = `zone:${region}:${zoneId}:${zoneType}`;

  try {
    // Check cache first
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for zone: ${cacheKey}`);
      const parsed = JSON.parse(cachedData) as { zoneName: string };
      return parsed.zoneName || "";
    }

    let zoneName = "";

    if (zoneType === "availability-zone") {
      // Initialize EC2 client
      const ec2Client = new EC2Client({
        region,
        credentials: {
          accessKeyId: env.PROTEUS_IAM_ACCESS_KEY_ID || "",
          secretAccessKey: env.PROTEUS_IAM_SECRET_ACCESS_KEY || "",
        },
      });

      // Describe availability zones
      const command = new DescribeAvailabilityZonesCommand({
        ZoneIds: [zoneId],
      });
      const result = await ec2Client.send(command);
      zoneName = result.AvailabilityZones?.[0]?.ZoneName || "";
    } else if (zoneType === "wavelength-zone") {
      // Parse zone name from wavelength zone ID
      const parts = zoneId.split("wl1-");
      if (parts.length > 1) {
        zoneName = parts.pop() || "";
      }
    }

    if (zoneName) {
      await redis.setex(cacheKey, cacheTTL, JSON.stringify({ zoneName }));
    }

    return zoneName;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in getAvailabilityZonesNameById:", message);
    return "";
  }
}

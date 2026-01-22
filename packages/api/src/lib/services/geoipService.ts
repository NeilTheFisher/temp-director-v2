/**
 * MaxMind GeoIP Service
 * Fetches mobile user information (MCC, MNC) from IP addresses
 */

import { env } from "@director_v2/config";
import { redis } from "@director_v2/db";

interface MobileUserInfo {
  mcc: number;
  mnc: number;
  city: string;
  country: string;
  error: string;
}

const CACHE_TTL = 15 * 60; // 15 minutes

/**
 * Get mobile user info from IP address
 */
export async function getMobileUserInfo(ip: string): Promise<MobileUserInfo> {
  let mcc = 0;
  let mnc = 0;
  let city = "";
  let country = "";
  let error = "";

  const cacheKey = `mobileUserInfo:${ip}`;

  try {
    // Check cache first
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for IP: ${ip}`);
      const parsedData = JSON.parse(cachedData) as {
        mcc: number;
        mnc: number;
        city: string;
        country: string;
      };
      return {
        mcc: parsedData.mcc,
        mnc: parsedData.mnc,
        city: parsedData.city,
        country: parsedData.country,
        error: "",
      };
    }

    const mccMncUserInfo = await checkIpMccMnc(ip);
    mcc = mccMncUserInfo.mcc;
    mnc = mccMncUserInfo.mnc;
    city = mccMncUserInfo.city;
    country = mccMncUserInfo.country;
    error = mccMncUserInfo.error;

    // Update cache
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify({ mcc, mnc, city, country }));
  } catch (err: unknown) {
    error = err instanceof Error ? err.message : "Unknown error";
    console.error(error);
  }

  return { mcc, mnc, city, country, error };
}

async function checkIpMccMnc(ip: string): Promise<{
  mcc: number;
  mnc: number;
  city: string;
  country: string;
  error: string;
}> {
  const cacheKey = `mccMncIpInfo:${ip}`;
  let mcc = 0;
  let mnc = 0;
  let city = "N/A";
  let country = "N/A";
  let error = "";

  try {
    // Check cache first
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for mcc/mnc IP: ${ip}`);
      const parsedData = JSON.parse(cachedData) as {
        mcc: number;
        mnc: number;
        city: string;
        country: string;
      };
      return {
        mcc: parsedData.mcc,
        mnc: parsedData.mnc,
        city: parsedData.city,
        country: parsedData.country,
        error: "",
      };
    }

    const usernamePassword = env.WLZ_BELL_PASSWORD ?? "";
    if (!usernamePassword) {
      throw new Error("WLZ_BELL_PASSWORD not configured");
    }

    const authHeader = `Basic ${Buffer.from(usernamePassword).toString("base64")}`;

    const response = await fetch(`https://geoip.maxmind.com/geoip/v2.1/city/${ip}`, {
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    });

    const data = (await response.json()) as {
      traits?: { mobile_country_code?: number; mobile_network_code?: number };
      city?: { names?: { en?: string } };
      country?: { names?: { en?: string } };
    };

    if (data.traits?.mobile_country_code) {
      mcc = data.traits.mobile_country_code;
      mnc = data.traits.mobile_network_code || 0;
    }

    if (data.city?.names?.en) {
      city = data.city.names.en.toLowerCase();
    }

    if (data.country?.names?.en) {
      country = data.country.names.en.toLowerCase();
    }

    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify({ mcc, mnc, city, country }));
  } catch (err: unknown) {
    error = err instanceof Error ? err.message : "Unknown error";
    console.error(`checkIpMccMnc: ${error}`);
  }

  return {
    mcc,
    mnc,
    city,
    country,
    error,
  };
}

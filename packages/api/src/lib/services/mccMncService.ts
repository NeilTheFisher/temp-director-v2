/**
 * MCC/MNC Rules Service
 * Determines appropriate stream URL based on mobile network codes and rules
 */

import prisma from "@director_v2/db";

/**
 * Get appropriate URL based on MCC/MNC rules
 */
export async function getMccMncRulesUrl(
  mcc = 0,
  mnc = 0,
  msisdn = "",
  city = "",
  countryCode = 0,
  regionCode = "",
) {
  let rules: Record<string, unknown> = { static: "", city: "", msisdn: "" };
  const result = {
    url: "",
    description: `No Rule was matched to the msisdn: ${msisdn}`,
  };

  const strCountryCode = String(countryCode);
  const strRegionCode = regionCode.toLowerCase();
  const strCity = city.toLowerCase();

  try {
    const mccMncData = await prisma.mcc_mnc.findFirst({
      where: { mcc: mcc, mnc: mnc },
      select: { id: true, mcc: true, mnc: true, rules: true },
    });

    if (mccMncData) {
      rules = JSON.parse(mccMncData.rules || "{}") as Record<string, unknown>;
    }

    const networkType = mcc === 0 && mnc === 0 ? "wifi" : "mobile";
    const msisdnRules = (rules.msisdn || {}) as Record<string, unknown>;
    const cityRules = (rules.city || {}) as Record<string, unknown>;
    const countryCodeRules = (rules.country_code || {}) as Record<
      string,
      Record<string, unknown>
    >;
    const regionCodeRules = ((
      countryCodeRules[strCountryCode] as Record<string, unknown>
    )?.region || {}) as Record<string, unknown>;

    // Process MSISDN-specific rules
    if (msisdn in msisdnRules) {
      const msisdnRule = msisdnRules[msisdn] as
        | Record<string, unknown>
        | undefined;
      if (msisdnRule && typeof msisdnRule.url === "string") {
        result.url = msisdnRule.url;
        result.description = `Msisdn specific ${networkType} rule for msisdn: ${msisdn} was applied`;
        return result;
      }
      const cityData =
        (msisdnRule?.city as Record<string, Record<string, unknown>>) || {};
      if (strCity in cityData && typeof cityData[strCity]?.url === "string") {
        result.url = cityData[strCity].url as string;
        result.description = `Msisdn specific ${networkType} rule for msisdn: ${msisdn} for a city ${strCity} was applied`;
        return result;
      }
    }

    // Process city-specific rules
    if (city in cityRules) {
      const cityRule = cityRules[city] as Record<string, unknown> | undefined;
      if (cityRule && typeof cityRule.url === "string") {
        result.url = cityRule.url;
        result.description = `${networkType.charAt(0).toUpperCase() + networkType.slice(1)} rule for city: ${city} and msisdn: ${msisdn} was applied`;
        return result;
      }
    }

    // Process country and region-specific rules
    if (
      strCountryCode in countryCodeRules &&
      strRegionCode in regionCodeRules
    ) {
      const regionRule = regionCodeRules[strRegionCode] as
        | Record<string, unknown>
        | undefined;
      if (regionRule && typeof regionRule.url === "string") {
        result.url = regionRule.url;
        result.description = `${networkType.charAt(0).toUpperCase() + networkType.slice(1)} rule for country code: ${strCountryCode} and region: ${strRegionCode} and msisdn: ${msisdn} was applied`;
        return result;
      }
    }

    // Apply general static rule if available
    if (rules.static && typeof rules.static === "string") {
      result.url = rules.static;
      result.description = `General static rule for msisdn: ${msisdn} was applied`;
      return result;
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Error in getMccMncRulesUrl:", message);
  }

  return result;
}

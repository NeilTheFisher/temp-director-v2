import {
  type CountryCode,
  getCountryCallingCode,
  parsePhoneNumberWithError,
} from "libphonenumber-js";

export function parseDomainDetails(url: string): {
  currentDomain: string;
  protocol: string;
} {
  try {
    const urlObj = new URL(url);
    return {
      currentDomain: urlObj.hostname,
      protocol: urlObj.protocol,
    };
  } catch {
    // Fallback for invalid URLs
    const match = url.match(/(?:https?:\/\/)?([^/:]+)/);
    return {
      currentDomain: match?.[1] || url,
      protocol: url.includes("https") ? "https:" : "http:",
    };
  }
}

export function getPhoneDetails(
  msisdn: string,
): { countryCode: number; regionCode: string } | null {
  if (!msisdn || msisdn.length < 3) {
    return null;
  }

  try {
    // Try to parse the phone number (add + prefix if not present)
    const phoneNumber = parsePhoneNumberWithError(
      msisdn.startsWith("+") ? msisdn : `+${msisdn}`,
    );

    if (!phoneNumber) {
      return null;
    }

    // Get country code and region from parsed phone number
    const countryCode = Number.parseInt(
      getCountryCallingCode(phoneNumber.country as CountryCode),
      10,
    );
    const regionCode = phoneNumber.country || "US";

    return {
      countryCode,
      regionCode,
    };
  } catch {
    // Fallback to default if parsing fails
    return {
      countryCode: 1,
      regionCode: "US",
    };
  }
}

export function concatenateAndConvertToHex(
  length: number,
  value: string,
): string {
  const paddedValue = value.padStart(length, "0");
  let hex = "";
  for (let i = 0; i < paddedValue.length; i++) {
    hex += paddedValue.charCodeAt(i).toString(16);
  }
  return hex.substring(0, length * 2);
}

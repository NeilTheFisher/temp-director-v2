import { type CountryCode, parsePhoneNumberWithError } from "libphonenumber-js";

export function validateAndFormatPhoneNumber(strMsisdn: string, strCountryCode = "") {
  const normalizedCountryCode = (strCountryCode.toUpperCase() || "US") as CountryCode;
  const strFormattedMsisdn = strMsisdn.replace(/\D/g, "");

  const result = {
    msisdn: strFormattedMsisdn,
    code: 200,
    error: "",
    formatted: strFormattedMsisdn,
    valid: false,
    country_code: normalizedCountryCode,
  };

  try {
    // Try to parse the phone number with country code
    const phoneNumber = parsePhoneNumberWithError(
      strMsisdn.startsWith("+") ? strMsisdn : `+${strMsisdn}`,
      normalizedCountryCode
    );
    if (!phoneNumber.isValid?.()) {
      result.error = "Not_Valid_Phone_Number";
      result.code = 200;
      return result;
    }

    // Format the phone number to E.164 format (international format)
    result.formatted = phoneNumber.format("E.164").replace(/\D/g, "");
    result.valid = true;
    result.code = 200;
    result.error = "";
    result.country_code = phoneNumber.country || normalizedCountryCode;
  } catch (objException: unknown) {
    const errorMessage = objException instanceof Error ? objException.message : "Unknown error";
    console.error(`Phone validation error for number: ${strMsisdn}, error: ${errorMessage}`);
    result.code = 500;
    result.error = errorMessage;
    result.valid = false;
  }

  return result;
}

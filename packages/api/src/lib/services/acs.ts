import { env } from "@director_v2/env/server";

interface SoapResponse {
  code: number;
  message: string;
}

export async function createUser(
  msisdn: string,
  otp: string,
  countryCode = "CA"
): Promise<SoapResponse> {
  console.info(`AcsService.createUser: creating user ${msisdn}`);

  try {
    const response = await sendSoapRequest("create", msisdn, otp, countryCode);
    return response;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("AcsService.createUser:", errorMessage);
    return {
      code: 500,
      message: `Msisdn: ${msisdn} error: ${errorMessage}`,
    };
  }
}

export async function updateUser(
  msisdn: string,
  otp: string,
  countryCode = "CA"
): Promise<SoapResponse> {
  console.info(`AcsService.updateUser: updating user ${msisdn}`);

  try {
    const response = await sendSoapRequest("update", msisdn, otp, countryCode);
    return response;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("AcsService.updateUser: error ->", errorMessage);
    return {
      code: 500,
      message: `Msisdn: ${msisdn} error: ${errorMessage}`,
    };
  }
}

async function sendSoapRequest(
  method: "create" | "update",
  msisdn: string,
  otp: string,
  countryCode: string
): Promise<SoapResponse> {
  const endpoint = env.ACS_API_ENDPOINT ?? "";
  const provisioningPath = env.ACS_PROVISIONING_PATH ?? "/soap/?wsdl";
  const impuTemplate = env.ACS_API_IMPU_TEMPLATE ?? "";
  const impiTemplate = env.ACS_API_IMPI_TEMPLATE ?? "";

  if (!impuTemplate || !impiTemplate) {
    return {
      code: 500,
      message: "Missing one or more required configs: ACS_API_IMPU_TEMPLATE, ACS_API_IMPI_TEMPLATE",
    };
  }

  const url = `${endpoint}${provisioningPath}`;
  const soapMethod = method === "create" ? "createSubscriber" : "updateSubscriber";

  const xmlPayload = buildSoapRequest(
    method,
    soapMethod,
    msisdn,
    otp,
    countryCode,
    impuTemplate,
    impiTemplate
  );

  console.info(`AcsService.sendSoapRequest: ${method} to ${url}`);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        SOAPAction: `urn:acswsdl#${soapMethod}`,
        "Content-Type": "text/xml; charset=utf-8",
        Connection: "Keep-Alive",
      },
      body: xmlPayload,
    });

    if (!response.ok) {
      return {
        code: response.status,
        message: `ACS API returned status ${response.status}`,
      };
    }

    const responseBody = await response.text();
    const result = parseSoapResponse(responseBody);
    return result;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`SOAP request failed: ${errorMessage}`);
  }
}

function buildSoapRequest(
  method: "create" | "update",
  soapMethod: string,
  msisdn: string,
  otp: string,
  countryCode: string,
  impuTemplate: string,
  impiTemplate: string
): string {
  const impi = impiTemplate.replace("<MDN>", msisdn);
  const impu = impuTemplate.split(",").map((item) => item.replace("<MDN>", msisdn));

  let subscriberElement = `
    <SubscriberData xsi:type="ns1:Subscriber">
      <msisdn xsi:type="xsd:string">${msisdn}</msisdn>
      <countryCode xsi:type="xsd:string">${countryCode}</countryCode>
      <impi xsi:type="xsd:string">${impi}</impi>
      <imei xsi:type="xsd:string"></imei>
      <imsi xsi:type="xsd:string"></imsi>
      <impu SOAP-ENC:arrayType="xsd:string[${impu.length}]" xsi:type="ns1:ValueList">
        ${impu.map((item) => `<item xsi:type="xsd:string">${item}</item>`).join("\n        ")}
      </impu>
      <password xsi:type="xsd:string">${randomString(32)}</password>
      <state xsi:type="xsd:string">active</state>
      <transparentData xsi:type="xsd:string"></transparentData>
      <directorotp xsi:type="xsd:string">${otp}</directorotp>
    </SubscriberData>`;

  if (method === "update") {
    subscriberElement = `<MSISDN xsi:type="xsd:string">${msisdn}</MSISDN>\n    ${subscriberElement}`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope
  xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:ns1="urn:acswsdl"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/"
  SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
  <SOAP-ENV:Header/>
  <SOAP-ENV:Body>
    <ns1:${soapMethod}>
      ${subscriberElement}
    </ns1:${soapMethod}>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;
}

function parseSoapResponse(xmlString: string): SoapResponse {
  // Simple XML parsing for error code and message
  const errorCodeMatch = xmlString.match(/<errorCode[^>]*>(\d+)<\/errorCode>/);
  const errorMessageMatch = xmlString.match(/<errorMessage[^>]*>([^<]+)<\/errorMessage>/);

  const errorCode = errorCodeMatch ? Number.parseInt(errorCodeMatch[1]!, 10) : -1;
  const errorMessage = errorMessageMatch ? errorMessageMatch[1] : "Unknown error";

  if (errorCode === 0) {
    return { code: 200, message: "User provisioned successfully" };
  }

  return {
    code: 403,
    message: `Provisioning failed with code: ${errorCode}, message: ${errorMessage} (Retry later)`,
  };
}

function randomString(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

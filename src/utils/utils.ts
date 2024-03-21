import axios from "axios"
import { randomBytes } from "crypto"
import fs from "fs"
import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber" // Import the necessary library
import * as isoCountries from "i18n-iso-countries"
import jwt from "jsonwebtoken"
import { SettingService } from "../services/SettingService"
import { Setting } from "../entity/Setting"

interface ValidationResult {
	msisdn: string
	code: number
	error: string
	formatted: string
	valid: boolean
	country_code: string
}

interface Country {
	code: string
	name: string
	number: number
}

type CountryMap = { [code: string]: Country }

export async function verifyAccess(authHeader: string): Promise<string> {
	console.log("verifyAccess")

	// validate client_id and client_secret

	const publicKey = fs.readFileSync("./priv/public.key", "utf8")

	// const authHeader = request.headers['authorization'];
	const token = authHeader?.split(" ")[1]
	let userId = undefined
	try {
		const decodedToken = jwt.verify(token, publicKey, { algorithms: ["RS256"], clockTolerance: 250 })
		// console.log(Date.now().toString(), "decodedToken-> ", decodedToken);
		if (decodedToken) {
			userId = decodedToken?.sub
			return userId as string
		}
	} catch (exception: unknown) {
		console.error("exception:", exception)
	}
	return "false"
}

export async function validateAndFormatPhoneNumber(
	strMsisdn: string,
	strCountryCode: string = ""
	// boolAddCountryCode: boolean = true
): Promise<ValidationResult> {
	const phoneUtil = PhoneNumberUtil.getInstance()

	strCountryCode = strCountryCode.toUpperCase()
	const strFormattedMsisdn = strMsisdn.replace(/\D/g, "")

	const result: ValidationResult = {
		msisdn: strFormattedMsisdn,
		code: 200,
		error: "",
		formatted: strFormattedMsisdn,
		valid: false,
		country_code: strCountryCode,
	}

	try {
		const settingService = new SettingService()
		const accountSid = await settingService.getSystemSetting(Setting.TWILIO_ACCOUNT_SID)
		const authToken = await settingService.getSystemSetting(Setting.TWILIO_AUTH_TOKEN)
		console.log("SID:", accountSid)
		const response = await axios.get(`https://lookups.twilio.com/v1/PhoneNumbers/+${strMsisdn}`, {
			auth: {
				username: String(accountSid),
				password: String(authToken),
			},
		})

		const objPhoneNumber = response.data
		console.log("Utils.validateAndFormatPhoneNumber: response from twilio:", objPhoneNumber)
		result.formatted = objPhoneNumber.phone_number.replace(/\D/g, "")
		result.country_code = objPhoneNumber.country_code
		result.valid = true
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (objException: any) {
		console.error(
			`Utils.validateAndFormatPhoneNumber: strMsisdn: ${strMsisdn}, error => ${objException.message}, statusCode => ${objException.code}`
		)
		result.code = 500
		result.error = objException.message
	}

	if (!result.valid) {
		try {
			console.log("Failed to validate, trying lib instead")

			const countryNumber = strMsisdn.slice(0, -10)
			const country: Country | undefined = getCountryByNumber(countryNumber, getCountryCodesList())
			console.log("Got country ", country)

			const phoneNumber = phoneUtil.parse(strMsisdn, country?.code ?? "CA")
			const formattedNumber = phoneUtil.format(phoneNumber, PhoneNumberFormat.E164)

			if (phoneUtil.isValidNumberForRegion(phoneNumber, country?.code)) {
				result.formatted = formattedNumber.replace(/\D/g, "")
				result.error = ""
				result.code = 200
				result.valid = true
			} else {
				result.error = "Not a valid phone number"
				result.code = 500
				result.valid = false
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (objException: any) {
			console.error(
				`Utils.validateAndFormatPhoneNumber.phoneUtil: strMsisdn: ${strMsisdn}, error => ${objException.message}`
			)
			result.code = 500
			result.error = objException.message
		}
	}
	console.log("Utils.validateAndFormatPhoneNumber.result: ", result)
	return result
}

// function getCountryNumberByCode(
// 	strRegion: string = 'CA',
// 	arrCountryCodes: CountryMap
// ): number {
// 	const normalizedRegion = strRegion.toLowerCase()
// 	const country = arrCountryCodes[normalizedRegion]
// 	console.log('country:', country)

// 	return country ? country.number || 1 : 1
// }

function getCountryByNumber(countryNumber: string, countryMap: CountryMap): Country | undefined {
	for (const code in countryMap) {
		const country = countryMap[code]
		if (countryNumber === String(country.number)) {
			return country
		}
	}
	return undefined
}

function getCountryCodesList(): CountryMap {
	const phoneNumberUtil = PhoneNumberUtil.getInstance()
	const arrRawCountryCodes = phoneNumberUtil.getSupportedRegions()
	const arrCountryCodes: CountryMap = {}

	for (const strRegion of arrRawCountryCodes) {
		const countryCode = phoneNumberUtil.getCountryCodeForRegion(strRegion)
		const strCountryName = getCountryNameFromCode(strRegion) ?? "" // Assuming you have a function getCountryNameFromCode()

		arrCountryCodes[strRegion] = {
			code: strRegion,
			name: strCountryName,
			number: countryCode,
		}
	}

	// Assuming you have a function sortCountryCodeList()
	const sortedCountryCodes = sortCountryCodeList(arrCountryCodes)
	return sortedCountryCodes
}

function getCountryNameFromCode(countryCode: string): string | undefined {
	try {
		return isoCountries.getName(countryCode, "en")
	} catch (error) {
		// Return the country code if an error occurs (e.g., for an invalid code)
		return countryCode
	}
}

function sortCountryCodeList(countryMap: CountryMap): CountryMap {
	// Convert the object to an array of key-value pairs
	const arrList: [string, Country][] = Object.entries(countryMap)

	// Sort the array based on the 'number' field
	arrList.sort(([, a], [, b]) => a.number - b.number)

	// Filter specific entries for countries 'ca' and 'us'
	const specificEntries = arrList.filter(([, item]) => ["ca", "us"].includes(item.code.toLowerCase()))

	// Filter non-specific entries (countries other than 'ca' and 'us')
	const nonSpecificEntries = arrList.filter(([, item]) => !["ca", "us"].includes(item.code.toLowerCase()))

	// Merge specific and non-specific entries and convert back to an object
	return Object.fromEntries(specificEntries.concat(nonSpecificEntries))
}

/**
 * Generate a random string of a specified length.
 * @param length The desired length of the random string.
 * @returns The generated random string.
 */
export function randomString(length: number): string {
	let result = ""

	while (result.length < length) {
		const remainingSize = length - result.length
		const bytes = randomBytes(remainingSize)

		// Remove unwanted characters and concatenate to the result
		result += Buffer.from(bytes).toString("base64").replace(/[+=.]/g, "").substr(0, remainingSize)
	}

	return result
}

export function capitalize(string: string): string {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

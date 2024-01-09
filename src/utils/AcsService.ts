import soapRequest from 'easy-soap-request'
import { parseString } from 'xml2js'
import { create } from 'xmlbuilder2'
import { randomString } from './utils'

export class AcsService {
	constructor() {}

	private createSoapClientRequest(
		method: string,
		strMsisdn: string,
		strOtp: string,
		countryCode = 'CA',
		strPassword?: string
	)
	{
		const strUrl: string = `${process.env.ACS_API_ENDPOINT ?? ''}${
			process.env.ACS_PROVISIONING_PATH ?? '/soap/?wsdl'
		}`
		console.info(
			`AcsService.createSoapClientRequest: provisionUser.url: ${strUrl}`
		)
		const strImpuTemplate: string = process.env.ACS_API_IMPU_TEMPLATE ?? ''
		const strImpiTemplate: string = process.env.ACS_API_IMPI_TEMPLATE ?? ''

		if (!strUrl || !strImpuTemplate || !strImpiTemplate) {
			return {
				message:
					'Missing one or more required configs: ACS_API_ENDPOINT, ACS_API_IMPU_TEMPLATE, ACS_API_IMPI_TEMPLATE',
				code: 500,
			}
		}

		let type: string = 'createSubscriber'
		if (method === 'update') {
			type = 'updateSubscriber'
		}

		const arrHeader: unknown = {
			SOAPAction: `urn:acswsdl#${type}`,
			'Content-Type': 'text/xml; charset=utf-8',
			Connection: 'Keep-Alive',
		}
		const arrRequest = {
			msisdn: strMsisdn,
			impi: strImpiTemplate.replace('<MDN>', strMsisdn),
			impu: strImpuTemplate
				.split(',')
				.map((item: string) => item.replace('<MDN>', strMsisdn)),
			countryCode,
			imei: '',
			imsi: '',
			state: 'active',
			transparentData: '',
			password: strPassword ?? randomString(32),
			directorotp: strOtp,
		}

		const xml = create()
			.ele('SOAP-ENV:Envelope', {
				'xmlns:SOAP-ENV': 'http://schemas.xmlsoap.org/soap/envelope/',
				'xmlns:ns1': 'urn:acswsdl',
				'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
				'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
				'xmlns:SOAP-ENC': 'http://schemas.xmlsoap.org/soap/encoding/',
				'SOAP-ENV:encodingStyle':
				'http://schemas.xmlsoap.org/soap/encoding/',
			})
			.ele('SOAP-ENV:Header')
			.up()
			.ele('SOAP-ENV:Body')
			.ele(`ns1:${type}`)
		if (method === 'update') {
			xml.ele('MSISDN', { 'xsi:type': 'xsd:string' })
				.txt(arrRequest.msisdn)
				.up()
		}

		xml.ele('SubscriberData', { 'xsi:type': 'ns1:Subscriber' })
			.ele('msisdn', { 'xsi:type': 'xsd:string' })
			.txt(arrRequest.msisdn)
			.up()
			.ele('countryCode', { 'xsi:type': 'xsd:string' })
			.txt(arrRequest.countryCode)
			.up()
			.ele('impi', { 'xsi:type': 'xsd:string' })
			.txt(arrRequest.impi)
			.up()
			.ele('imei', { 'xsi:type': 'xsd:string' })
			.txt(arrRequest.imei)
			.up()
			.ele('imsi', { 'xsi:type': 'xsd:string' })
			.txt(arrRequest.imsi)
			.up()
			.ele('impu', {
				'SOAP-ENC:arrayType': 'xsd:string[2]',
				'xsi:type': 'ns1:ValueList',
			})
			.ele('item', { 'xsi:type': 'xsd:string' })
			.txt(arrRequest.impu[0])
			.up()
			.ele('item', { 'xsi:type': 'xsd:string' })
			.txt(arrRequest.impu[1])
			.up()
			.up()
			.ele('password', { 'xsi:type': 'xsd:string' })
			.txt(arrRequest.password)
			.up()
			.ele('state', { 'xsi:type': 'xsd:string' })
			.txt('active')
			.up()
			.ele('transparentData', { 'xsi:type': 'xsd:string' })
			.txt('')
			.up()
			.ele('directorotp', { 'xsi:type': 'xsd:string' })
			.txt(strOtp)
			.up()
			.up()
			.up()

		// Get the XML string
		const xmlString = xml.end({ prettyPrint: true })

		return {
			soapClient: soapRequest({
				url: strUrl,
				headers: String(arrHeader),
				xml: xmlString,
			}),
		}
	}

	async createUser(
		strMsisdn: string,
		strOtp: string,
		countrycode: string,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		objRequest?: any
	) {
		try {
			console.info(`AcsService.createUser: creating user ${strMsisdn}`)
			objRequest =
			objRequest ||
			this.createSoapClientRequest(
				'create',
				strMsisdn,
				strOtp,
				countrycode
			)
			const { response } = await objRequest.soapClient

			const xmlString = response.body
			let errorCode = -1
			let errorMessage = ''
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			parseString(xmlString, (err: any, result: any) => {
				if (err) {
					console.error('Error parsing XML:', err)
					return
				}
				errorCode =
					result['SOAP-ENV:Envelope']['SOAP-ENV:Body'][0][
						'ns1:createSubscriberResponse'
					][0]['return'][0]['errorCode'][0]._
				errorMessage =
					result['SOAP-ENV:Envelope']['SOAP-ENV:Body'][0][
						'ns1:createSubscriberResponse'
					][0]['return'][0]['errorMessage'][0]._
			})

			if (errorCode == 0) {
				return { message: `User ${strMsisdn} provisioned`, code: 200 }
			} else {
				console.error(
					`AcsService.createUser: Provisioning failed for MSISDN:${strMsisdn} with code: ${errorCode}, message: ${errorMessage} (Retry later)`
				)
				return {
					message: `Provisioning failed for MSISDN:${strMsisdn} with code: ${errorCode}, message: ${errorMessage} (Retry later)`,
					code: 403,
				}
			}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			const strError = error.message
			console.error('AcsService.createUser:', strError)
			return {
				message: `Msisdn: ${strMsisdn} error: ${strError} statusCode: ${error.statusCode}`,
				code: 500,
			}
		}
	}

	async updateUser(
		strMsisdn: string,
		strOtp: string,
		countrycode: string,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		objRequest?: any
	)
	{
		try {
			console.info(`AcsService.updateUser: updating user ${strMsisdn}`)
			objRequest =
			objRequest ||
			this.createSoapClientRequest(
				'update',
				strMsisdn,
				strOtp,
				countrycode
			)
			const { response } = await objRequest.soapClient
			const xmlString = response.body
			let errorCode = -1
			let errorMessage = ''
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			parseString(xmlString, (err: any, result: any) => {
				if (err) {
					console.error('Error parsing XML:', err)
					return
				}
				errorCode =
					result['SOAP-ENV:Envelope']['SOAP-ENV:Body'][0][
						'ns1:updateSubscriberResponse'
					][0]['return'][0]['errorCode'][0]._
				errorMessage =
					result['SOAP-ENV:Envelope']['SOAP-ENV:Body'][0][
						'ns1:updateSubscriberResponse'
					][0]['return'][0]['errorMessage'][0]._
			})

			if (errorCode == 0) {
				return { message: `User ${strMsisdn} updated`, code: 200 }
			} else {
				console.error(
					`AcsService.updateUser: Provisioning failed for MSISDN:${strMsisdn} with code: ${errorCode}, message: ${errorMessage} (Retry later)`
				)
				return {
					message: `Provisioning failed for MSISDN:${strMsisdn} with code: ${errorCode}, message: ${errorMessage} (Retry later)`,
					code: 403,
				}
			}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			const strError = error.message
			console.error('AcsService.updateUser: error ->', strError)
			return {
				message: `Msisdn: ${strMsisdn} error: ${strError} statusCode: ${error.statusCode}`,
				code: 500,
			}
		}
	}

	// Similar changes for updateUser function
}

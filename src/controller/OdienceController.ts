import { Request, Response } from "express"
import { OdienceService } from "../services/OdienceService"

const odienceService = new OdienceService()
class OdienceController {
	public static odience = async (req: Request, res: Response) => {
		console.log("OdienceController.odience:")
		const rawMsisdn: string = (req.query["msisdn"] ?? "") as string
		try {
			const objResponse = await odienceService.provisionUser(req, res, rawMsisdn)
			return (objResponse.code || 0) !== 200
				? res.status(objResponse.code || 500).send(objResponse.message || "")
				: res.send(objResponse.message || "")

		} catch (error: any) {
			console.error(`OdienceController.odience: for msisdn: ${rawMsisdn || ""}, error => ${error.message || ""}`)
			return res.status(500).send(`OdienceController.odience. msisdn: ${rawMsisdn || ""} failed with error: ${error.message || ""}`)
		}
	}
}

export default OdienceController

import { Request, Response } from "express"
import { OdienceService } from "../services/OdienceService"
import { validateAndFormatPhoneNumber } from "../utils/utils"
import { S3Service } from "../services/S3Service"

const odienceService = new OdienceService()
const s3Service = new S3Service()
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
      console.error(
        `OdienceController.odience: for msisdn: ${rawMsisdn || ""}, error => ${error.message || ""}`
      )
      return res
        .status(500)
        .send(
          `OdienceController.odience. msisdn: ${rawMsisdn || ""} failed with error: ${error.message || ""}`
        )
    }
  }
  public static validatePhoneNumber = async (req: Request, res: Response) => {
    const msisdn = req.params.msisdn
    const country_code = req.params.country_code
    console.log(`OdienceController.validatePhoneNumber: msisdn: ${msisdn || ""}`)
    if(!msisdn)
    {
      return res
        .status(500)
        .send(
          `OdienceController.validatePhoneNumber. msisdn: ${msisdn || ""} country_code: ${country_code || ""} failed with error: missing request params`
        )
    }
    else
    {
      const objResponse =  await validateAndFormatPhoneNumber(msisdn, country_code)
      return (objResponse.code || 0) !== 200
        ? res.status(objResponse.code || 500).send(objResponse || "")
        : res.send(objResponse)
    }
  }

  public static getCategoryList = async (req: Request, res: Response) => {
    const categories = ["concert", "sport", "shopping",
      "gaming", "entertainment", "collaboration",
      "conference", "simulation", "museum",
      "travel", "bingo", "interview", "location", "personal", "activities"]
    try {
      const categoryUrlMap = new Map(categories.map(category => [category, s3Service.getUrlFromPath("tags/"+category+".png")]))
      return res
        .status(200)
        .send(
          Object.fromEntries(categoryUrlMap)
        )
    }
    catch (error: any) {
      console.error(
        `OdienceController.getCategoryList: error => ${error.message || ""}`
      )
      return res
        .status(500)
        .send(
          `OdienceController.getCategoryList: failed with error: ${error.message || ""}`
        )
    }
  }
}

export default OdienceController

import { Request, Response } from "express"
import { verifyAccess } from "../utils/utils"
import { StreamUrlService } from "../services/StreamUrlService"

const streamUrlService = new StreamUrlService()

class StreamController {
  public static getStreamUrls = async (req: Request, res: Response) => {
    console.log("StreamController.getStreamUrls:")
    const streamUrlId = req.params.streamUrlId;
    if (req.headers.authorization) {
      const userId = await verifyAccess(req.headers.authorization)
      console.log("Jwt verify returned userId:", userId)
      
      const clientIp = typeof req.headers['x-forwarded-for'] === 'string'
      ? req.headers['x-forwarded-for'].split(',')[0].trim() // Get the first IP in case of a list
      : req.connection.remoteAddress || '';

      const streamInfo = await streamUrlService.getStreamUrls(parseInt(streamUrlId), parseInt(userId), clientIp)
      console.log(streamInfo)
      if (!streamInfo) {
        return res.status(401).json("Urls not found or not authenticated")
      } else {
        const body = JSON.stringify(streamInfo)
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
        res.setHeader("Pragma", "no-cache")
        res.setHeader("Expires", "0")
        res.setHeader("Content-Type", "application/json")
        return res.status(200).send(body)
      }
    }
    return res.status(401).send("No Authorization header")
  }
}

export default StreamController

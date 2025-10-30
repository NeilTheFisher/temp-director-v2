import { Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { User } from "../entity/User"
import { EventService } from "../services/EventService"
import { verifyAccess } from "../utils/utils"

const eventService = new EventService()
class EventController {
  public static list = async (req: Request, res: Response) => {
    console.log("EventController.list:")
    if (req.headers.authorization) {
      const userId = await verifyAccess(req.headers.authorization)
      console.log("Jwt verify returned userId:", userId)
      const userService = AppDataSource.getRepository(User)
      const user = await userService.findOne(
        {where: { id: parseInt(userId) }}
      );
      if (!user) {
        return res.status(401).json("User not found or not authenticated")
      } else {
        const body = await eventService.getEvents(user.msisdn!)
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
        res.setHeader("Pragma", "no-cache")
        res.setHeader("Expires", "0")
        res.setHeader("Content-Type", "application/json")
        return res.status(200).send(JSON.stringify(body))
      }
    }
    return res.status(401).send("No Authorization header")
  }
}

export default EventController

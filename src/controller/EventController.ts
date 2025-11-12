import { Request, Response } from "express"
import { EventService } from "../services/EventService"
import { UserService } from "../services/UserService"
import { verifyAccess } from "../utils/utils"

const eventService = new EventService()
const userService = new UserService()
class EventController {
  public static list = async (req: Request, res: Response) => {
    console.log("EventController.list:")
    if (req.headers.authorization) {
      const userId = await verifyAccess(req.headers.authorization)
      console.log("Jwt verify returned userId:", userId)
      const userInfo = await userService.getUserInfoForEvent(parseInt(userId))
      if (!userInfo) {
        return res.status(401).json("User not found or not authenticated")
      } else {
        const body = await eventService.getEvents(req, userInfo)
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
        res.setHeader("Pragma", "no-cache")
        res.setHeader("Expires", "0")
        res.setHeader("Content-Type", "application/json")
        return res.status(200).send(JSON.stringify(body))
      }
    }
    return res.status(401).send("No Authorization header")
  }

    public static partialList = async (req: Request, res: Response) => {
      console.log("EventController.partialList:")
      if (req.headers.authorization) {
        const userId = await verifyAccess(req.headers.authorization)
        console.log("Jwt verify returned userId:", userId)
        const userInfo = await userService.getUserInfoForEvent(parseInt(userId))
        if (!userInfo) {
          return res.status(401).json("User not found or not authenticated")
        } else {
          const body = await eventService.getEvents(req, userInfo, true)
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
          res.setHeader("Pragma", "no-cache")
          res.setHeader("Expires", "0")
          res.setHeader("Content-Type", "application/json")
          return res.status(200).send(JSON.stringify(body))
        }
      }
      return res.status(401).send("No Authorization header")
    }

    public static webEventsList = async (req: Request, res: Response) => {
      console.log("EventController.partialList:")
      const body = await eventService.getEvents(req, {userId: 0, msisdn: "", isSuperAdmin: false, emails: [], orgIds: []}, false, true)
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
      res.setHeader("Pragma", "no-cache")
      res.setHeader("Expires", "0")
      res.setHeader("Content-Type", "application/json")
      return res.status(200).send(JSON.stringify(body))
    }

    public static categories = async (req: Request, res: Response) => {
      console.log("EventController.categories:")
      if (req.headers.authorization) {
        const userId = await verifyAccess(req.headers.authorization)
        console.log("Jwt verify returned userId:", userId)
        const userInfo = await userService.getUserInfoForEvent(parseInt(userId))
        if (!userInfo) {
          return res.status(401).json("User not found or not authenticated")
        } else {
          const body = await eventService.getCategories(req, userInfo)
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

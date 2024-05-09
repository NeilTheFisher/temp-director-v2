import { Request, Response } from "express"
import { UserService } from "../services/UserService"
import { verifyAccess } from "../utils/utils"

const userService = new UserService()
class UserController {
  public static getUserInfo = async (req: Request, res: Response) => {
    console.log("UserController.getUserInfo:")
    if (req.headers.authorization) {
      const userId = await verifyAccess(req.headers.authorization)
      console.log("Jwt verify returned userId:", userId)
      const userInfo = await userService.getUserInfo(parseInt(userId))
      console.log(userInfo)
      if (!userInfo) {
        return res.status(401).json("User not found or not authenticated")
      } else {
        const body = JSON.stringify(userInfo)
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
        res.setHeader("Pragma", "no-cache")
        res.setHeader("Expires", "0")
        res.setHeader("Content-Type", "application/json")
        return res.status(200).send(body)
      }
    }
    return res.status(401).send("No Authorization header")
  }

  public static getUserInfoByMsisdn = async (req: Request, res: Response) => {
    const msisdn = req.params.msisdn
    console.log("UserController.getUserInfoByMsisdn: "+msisdn)
    if (req.headers.authorization) {
      try
      {
        const userId = await verifyAccess(req.headers.authorization)
        if(userId != "false")
        {
          console.log("Jwt verify returned userId:", userId)
          const userInfo = await userService.getUserInfoByMsisdn(msisdn)
          console.log(userInfo)
          if (!userInfo) {
            return res.status(401).json("User not found or not authenticated")
          } else {
            const body = JSON.stringify(userInfo)
            res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
            res.setHeader("Pragma", "no-cache")
            res.setHeader("Expires", "0")
            res.setHeader("Content-Type", "application/json")
            return res.status(200).send(body)
          }
        }
        else
        {
          return res.status(401).send("Unauthorized")
        }
      }
      catch(error: any)
      {
        return res
          .status(res.statusCode)
          .send(
            `OdienceController.getCategoryList: failed with error: ${error.message || ""}`
          )
      }

    }
    return res.status(401).send("No Authorization header")
  }
}

export default UserController

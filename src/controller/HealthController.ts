import { Request, Response } from "express"

class HealthController {
  public static health = async (req: Request, res: Response) => {
    console.log("HealthController.health:")
    return res.status(200).send("OK")
  }
}

export default HealthController

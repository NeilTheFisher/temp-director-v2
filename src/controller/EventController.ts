import { Request, Response } from "express"

class EventController {
	public static list = async (req: Request, res: Response) => {
		console.log("EventController.list:")
		return res.status(200).send("TODO")
	}
}

export default EventController

import { Router } from "express"
import EventController from "../controller/EventController"

const router = Router()

// Get all users

router.get("/web/api/eventsList", EventController.webEventsList)

export default router

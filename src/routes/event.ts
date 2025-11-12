import { Router } from "express"
import EventController from "../controller/EventController"

const router = Router()

// Get all users
router.get("/events", EventController.list)
router.get("/partialEvents", EventController.partialList)
router.get("/events/categories", EventController.categories)

export default router

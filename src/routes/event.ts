import { Router } from "express"
import EventController from "../controller/EventController"

const router = Router()

// Get all users
router.get("/events", EventController.list)

export default router

import { Router } from "express"
import StreamController from "../controller/StreamController"

const router = Router()

// Get all users
router.get("/getStreamUrls/:streamUrlId", StreamController.getStreamUrls)
export default router

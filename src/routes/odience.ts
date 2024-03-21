import { Router } from "express"
import OdienceController from "../controller/OdienceController"

const router = Router()

// Get all users
router.get("/odience", OdienceController.odience)

export default router

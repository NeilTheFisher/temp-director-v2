import { Router } from "express"
import HealthController from "../controller/HealthController"

const router = Router()

// Get all users
router.get("/health", HealthController.health)

export default router

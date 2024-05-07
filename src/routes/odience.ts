import { Router } from "express"
import OdienceController from "../controller/OdienceController"

const router = Router()

// Get all users
router.get("/odience", OdienceController.odience)
router.get("/validatePhoneNumber/:msisdn/:country_code?", OdienceController.validatePhoneNumber)
router.get("/mobile/categoryList", OdienceController.getCategoryList)
export default router

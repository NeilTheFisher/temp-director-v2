import { Router } from "express"
import UserController from "../controller/UserController"

const router = Router()

// Get all users
router.get("/getUserInfo", UserController.getUserInfo)
router.get("/getUserInfoByMsisdn/:msisdn", UserController.getUserInfoByMsisdn)

export default router

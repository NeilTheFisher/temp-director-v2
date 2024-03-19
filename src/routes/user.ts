import { Router } from 'express'
import UserController from '../controller/UserController'

const router = Router()

// Get all users
router.get('/getUserInfo', UserController.getUserInfo)

export default router

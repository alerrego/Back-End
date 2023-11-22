import { Router } from "express";
import { userService } from "../controllers/index.js";
import {currentAdmin} from "../middlewares/auth.js"

const router = Router()

router.post('/premium/:uID',currentAdmin,userService.updatePremium)

router.post('/user/:uID', currentAdmin ,userService.updateUser)

export default router
import { Router } from "express";
import { userService } from "../controllers/index.js";
import {currentAdmin, currentUser} from "../middlewares/auth.js"
import { uploader } from "../utils.js";
const router = Router()

router.post('/premium/:uID',currentAdmin,userService.updatePremium)

router.post('/user/:uID', currentAdmin ,userService.updateUser)

router.post('/:uID/documents',currentUser,uploader,userService.uploadDocuments)

export default router
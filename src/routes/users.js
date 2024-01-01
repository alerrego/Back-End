import { Router } from "express";
import { userService } from "../controllers/index.js";
import {currentAdmin, currentUser} from "../middlewares/auth.js"
import { uploader } from "../utils.js";
const router = Router()

router.get('/',currentAdmin,userService.getUsers)

router.get('/:uID',currentAdmin,userService.getUser)

router.post('/premium/:uID',currentAdmin,userService.updatePremium)

router.post('/user/:uID', currentAdmin ,userService.updateUser)

router.post('/:uID/documents',currentUser,uploader,userService.uploadDocuments)

router.delete("/:uID",currentAdmin,userService.deleteUser)

router.delete('/',currentAdmin,userService.deleteInactives)

export default router
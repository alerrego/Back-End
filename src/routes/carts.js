import { Router } from "express";
import { cartService } from "../controllers/index.js"
import { currentAdmin , currentUser } from "../middlewares/auth.js";

const router = Router();

router.get('/',currentAdmin, cartService.getCarts)//LO DEJO SOLO VER AL ADMIN ASI NO HAY CARGAS MAL INTENCIONADAS

router.get('/:cID', cartService.getCart)

router.post('/', cartService.getNewCart)

router.post('/:cID/purchase',currentUser, cartService.purchase)

router.put('/:cID/product/:pID',currentUser,cartService.addProduct)

router.delete('/:cID',cartService.deleteCart)

router.delete('/:cID/product/:pID',currentUser,cartService.deleteProduct)

export default router
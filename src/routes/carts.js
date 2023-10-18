import { Router } from "express";
import {getCarts, getCart, getNewCart, AddProduct, deleteCart, deleteProduct} from "../dao/mongo/controllers/CartManager.js";

const router = Router();

router.get('/',getCarts)

router.get('/:cID',getCart)

router.post('/',getNewCart)

router.put('/:cID/product/:pID',AddProduct)

router.delete('/:cID',deleteCart)

router.delete('/:cID/product/:pID',deleteProduct)

export default router
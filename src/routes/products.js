import { Router } from "express";

import {getProducts,getProduct,addProduct,addProducts,updateProduct,deleteProduct} from "../dao/mongo/controllers/ProductManager.js"

const router = Router()

router.get('/',getProducts)

router.get('/:pID',getProduct)

router.post('/',addProduct)

router.post('/many',addProducts)

router.put('/:pID', updateProduct)

router.delete('/:pID', deleteProduct)


export default router
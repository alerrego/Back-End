import { Router } from "express";
import { productService } from "../controllers/index.js";
import { currentAdmin,currentUser } from "../middlewares/auth.js";

const router = Router()

router.get('/',productService.getProducts)

router.get('/:pID', productService.getProduct)

router.get('/mock/mockingproducts', productService.getMockingProducts)

router.post('/',currentAdmin,productService.addProduct)

router.post('/many',currentAdmin,productService.addProducts)

router.put('/:pID',currentAdmin,productService.updateProduct)

router.delete('/:pID',currentAdmin,productService.deleteProduct)

export default router
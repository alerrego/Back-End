import { Router } from "express";
import { productService } from "../controllers/index.js";
import { currentAdmin,isPremiumOrAdmin} from "../middlewares/auth.js";

const router = Router()

router.get('/',productService.getProducts)

router.get('/:pID', productService.getProduct)

router.get('/mock/mockingproducts', productService.getMockingProducts)

router.post('/',isPremiumOrAdmin,productService.addProduct)

router.post('/many',currentAdmin,productService.addProducts)

router.put('/:pID',isPremiumOrAdmin,productService.updateProduct)

router.delete('/:pID',isPremiumOrAdmin,productService.deleteProduct)

export default router
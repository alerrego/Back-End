import { Router } from "express";
import ProductManager from "../classes/ProductManager.js";

const router = Router();

const ControladorDeProductos = new ProductManager()


router.get('/', async(req, res) => {

    const products = await ControladorDeProductos.getProducts();
    res.render('home', { products })
})

router.get('/realTimeProducts', async(req, res) => {
    res.render('realTimeProducts')
})


router.get("/chat", (req, res) => {
    res.render("chat");
  })

export default router;

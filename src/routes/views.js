import { Router } from "express";
import ProductManager from '../classes/ProductManager.js'
import __dirname from "../utils.js";

const router = Router();

const ControladorDeProductos = new ProductManager(__dirname+"/data/products.json")

router.get('/', async(req, res) => {

    const products = await ControladorDeProductos.getProducts();
    res.render('home', { products })
})

router.get('/realTimeProducts', async(req, res) => {
    res.render('realTimeProducts')
})

export default router
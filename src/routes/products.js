import { Router } from "express";
import { productService } from "../controllers/index.js";

const router = Router()

router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit ?? 10; //SI NO RECIBO NADA LE ASIGNO EL VALOR DSP DEL ??
        const page = req.query.page ?? 1;
        const sort = req.query.sort ?? undefined;
        const stock = req.query.stock ?? 1; //SI REBIBO 1 MUESTRO TODOS LOS PRODUCTOS EN VENTA
        const category = req.query.category ?? undefined;
        const products = await productService.getProducts(limit, page, sort, stock, category);
        
        res.send({ status: 'success', payload: products })
    }
    catch (error) {
        res.status(500).send({ status: 'error' })
    }
})

router.get('/:pID', async (req, res) => {
    try {
        const pID = req.params.pID
        const product = await productService.getProduct(pID)
        if (!product) {
            return res.status(404).send(`ID ${pID} not found`)
        }
        res.send({ status: 'success', payload: product })
    } catch (error) {
        res.status(500).send({ status: 'error' })
    }
})

router.post('/', async (req, res) => {
    try {
        const data = req.body
        const newProduct = await productService.addProduct(data)
        if (!newProduct) {
            return res.send({ status: "error", message: "data incorrect" })
        }
        res.send({ status: "succes", payload: newProduct })
    } catch (error) {
        res.status(500).send({ status: "error" })
    }
})

router.post('/many', async (req, res) => {
    try {
        const data = req.body
        const newProducts = await productService.addProducts(data)
        if (!newProducts) {
            return res.send({ status: "error", message: "data incorrect" })
        }
        res.send({ status: "succes", payload: newProducts })
    } catch (error) {
        res.status(500).send({ status: "error" })
    }
})

router.put('/:pID', async (req, res) => {
    try {
        const pID = req.params.pID
        const data = req.body
        const update = await productService.updateProduct(data,pID)
        if (!update) {
            return res.send({ status: 'error', message: 'data incorrect' })
        }
        res.send({ status: 'success', payload: update })
    } catch (error) {
        res.status(500).send({status:'error'})
    }
})

router.delete('/:pID', async (req, res) => {
    try{
        const pID = req.params.pID
        await productService.deleteProduct(pID)
        res.status.send({status:'success'})
    }catch(error){
        res.status(500).send({status:"error"})
    }
})

export default router
import { Router } from "express";

import ProductManager from "../classes/ProductManager.js";

const router = Router()

const ManejadorDeProductos = new ProductManager()

router.get('/', async(req,res) =>{
    try{
        const limit = req.query.limit ?? 10; //SI NO RECIBO NADA LE ASIGNO EL VALOR DSP DEL ??
        const page = req.query.page ?? 1;
        const sort = req.query.sort ?? undefined;
        const stock = req.query.stock ?? 1; //SI REBIBO 1 MUESTRO TODOS LOS PRODUCTOS EN VENTA
        const category = req.query.category ?? undefined;

        const products = await ManejadorDeProductos.getProducts(limit,page,sort,+stock,category)
        res.send({status:'succes',payload:products})
    }catch(error){
        console.log(error)
    }
})

router.get('/:pID',async(req,res) =>{
    try{
        const product = await ManejadorDeProductos.getProduct(req.params.pID);
        res.send({status:'succes',payload: product})
    }catch(error){
        res.status(404).send({status: 'ID NOT FOUND'})
    }
})
router.post('/', async(req,res) =>{
    try{
        const newProduct = await ManejadorDeProductos.addProduct(req.body)
        res.send({status:'succes',payload: newProduct})
    }catch(error){
        res.status(500).send(error)
    }
})

router.post('/many',async(req,res) =>{
    try{
        const newProducts = await ManejadorDeProductos.addProducts(req.body)
        res.send({status:'succes',payload: newProducts})
    }catch(error){
        res.status(500).send(error)
    }
})

router.put('/:pID', async(req,res) =>{
    try{
        const update = await ManejadorDeProductos.updateProduct(req.params.pID,req.body);
        res.send({status:'succes',payload: update})
    }catch(error){
        res.status(500).send(error)
    }
})

router.delete('/:pID', async(req,res) =>{
    try{
        await ManejadorDeProductos.deleteProduct(req.params.pID)
        res.send({status:'succes'})
    }catch(error){
        res.status(500).send(error)
    }
})


export default router
import { Router } from "express";

import ProductManager from "../classes/ProductManager.js";

const router = Router()

const ManejadorDeProductos = new ProductManager()

router.get('/', async(req,res) =>{
    const limit = req.query.limit
    if(limit){
        const productsLimit = await ManejadorDeProductos.getProducts(limit)
        res.send({status:'succes',payload:productsLimit})
        return
    }
    const products = await ManejadorDeProductos.getProducts()
    res.send({status:'succes',payload:products})
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
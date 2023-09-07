import { Router } from "express";
import ProductManager from "../classes/ProductManager.js";

const router = Router();

const ControladorDeProductos = new ProductManager('products.json')

router.get('/', async(req,res) => {
    const products = await ControladorDeProductos.getProducts() // OBTENGO LOS PRODUCTOS USO AWAIT PARA RESOLVER LA PROMISE
    
    let limit = req.query.limit //RECIBO EL LIMITE POR QUERY Y LO ALMACENO 

    if (!limit){
        res.send(products) //SI NO EXISTE EL LIMITE RECIBIDO RETORNO LA TOTALIDAD DE LOS PRODUCTOS
        return
    }

    res.send(products.slice(0,limit)) //USO SLICE Y LE MANDO LA POS 0 INICIO ARRAY Y EL LIMITE DEL QUERY
})

router.get('/:pid', async(req,res) => {
    let paramId = +req.params.pid; // LE AGREGO EL + PARA PASARLO A ENTERO Y ASI PODER COMPARAR NUMEROS Y NO UN STRING

    const product = await ControladorDeProductos.getProductById(paramId);

    if(!product){
        res.status(404).send(`No se encontro el ID ${paramId}`)
        return
    }

    res.send(product)

})

router.post('/', async(req,res) => {
    const product = req.body;

    if(await ControladorDeProductos.addProduct(product) != -1){
        res.send({status : 'succes'})
    }else{
        res.status(404).send(`Codigo de producto ya existente`)
    }


})

router.put('/:pid', async(req,res) =>{
    const idToUpdate = +req.params.pid
    const product = req.body;

    await ControladorDeProductos.updateProduct(idToUpdate,product)

    res.send({status : 'succes'} + `ID ${idToUpdate} is update`)
})

router.delete('/:pid', async(req,res) =>{
    const idDelete = +req.params.pid

    await ControladorDeProductos.deleteProduct(idDelete)

    res.send({status: 'succes'} + `ID ${idDelete} delete`)
})


export default router
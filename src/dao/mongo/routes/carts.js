import { Router } from "express";
import CartManager from "../classes/CartManager.js";

const router = Router();

const ManejadorDeCarritos = new CartManager()



router.get('/', async(req,res) =>{
    const carts = await ManejadorDeCarritos.getCarts()
    res.send({status:'succes',payload:carts});
})
router.get('/:cID', async(req,res) =>{
    const cartID = req.params.cID;
    const cart = await ManejadorDeCarritos.getCart(cartID)
    res.send({status:'succes',payload:cart});
})
router.post('/', async(req,res) =>{
        const newCart = await ManejadorDeCarritos.getNewCart()
        res.send({status:'succes', newCart})
})

router.put('/:cID/product/:pID',async(req,res) =>{
    try{    
        const cartID = req.params.cID;
        const productID = req.params.pID;
        const product = await ManejadorDeCarritos.AddProduct(cartID,productID)
        if( product === -1){
            res.status(404).send(`The ID of cart:${cartID} or ID of product:${productID} are incorrect`)
            return
        }
        res.send({status: 'succes'+` The product of ID ${productID} is added in cart ${cartID}`})
    }catch(error){
        console.log(error)
    }
})

router.delete('/:cID', async(req,res) =>{
    const cartID = req.params.cID;
    await ManejadorDeCarritos.deleteCart(cartID);
    res.send({status:'succes'});
})

router.delete('/:cID/product/:pID', async(req,res) =>{
    const cartID = req.params.cID;
    const productID = req.params.pID;
    const deleted = await ManejadorDeCarritos.deleteProduct(cartID,productID)
    if(deleted === -1){
        res.status(404).send(`ID CART OR ID PRODUCT ARE INCORRECT`)
        return
    }
    res.send({status:'succes'+` product ${productID} delete.`})
})

export default router
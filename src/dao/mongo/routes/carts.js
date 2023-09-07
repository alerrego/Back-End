import { Router } from "express";
import CartManager from "../classes/CartManager.js";

const router = Router();

const ManejadorDeCarritos = new CartManager()



router.get('/', async(req,res) =>{
    const carts = await ManejadorDeCarritos.getCarts()
    res.send({status:'succes',payload:carts});
})

router.post('/', async(req,res) =>{
        const newCart = await ManejadorDeCarritos.createCart()
        res.send({status:'succes', payload: newCart})
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

export default router
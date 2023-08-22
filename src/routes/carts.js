import { Router } from "express";
import CartManager from "../classes/CartManager.js";

const ManejadorDeCarritos = new CartManager('carts.json')
const router = Router();

router.post('/', async(req,res) =>{
    await ManejadorDeCarritos.createCart()
    res.send({status : 'succes'})
})

router.get('/:cid', async(req,res) =>{
    const cartID = +req.params.cid;
    const cartProducts = await ManejadorDeCarritos.getCartProducts(cartID);
    if(cartProducts != -1){
        res.send(cartProducts)
    }else{
        res.status(404).send(`ID ${cartID} not found`)
    }
})
router.post('/:cid/product/:pid', async(req,res) =>{
    const cartID = +req.params.cid;
    const productID = +req.params.pid;

    const cartProducts = await ManejadorDeCarritos.getCartProducts(cartID);
    if(cartProducts != -1){
        if(await ManejadorDeCarritos.addProduct(cartID,productID) != -1){
            res.send({status : 'succes'})
        }else{
            res.status(404).send(`The product of ID ${productID} does´nt exist`)
        }
    }else{
        res.status(404).send(`ID ${cartID} not found`)
    }
})
router.delete('/:cid', async(req,res) =>{
    const ID = +req.params.cid;
    
    if(await ManejadorDeCarritos.deleteCart(ID) == -1){
        res.status(404).send(`El carrito con ID ${ID} no existe`)
        return
    }
    res.status({status : 'succes'})
})

export default router
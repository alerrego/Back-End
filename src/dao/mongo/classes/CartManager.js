import { cartModel } from "../models/cart.js";
import productManager from '../classes/ProductManager.js'

const ManejadorDeProductos = new productManager();

export default class CartManager {
    constructor (){

    }
    getCarts = async() =>{
        const carts = await cartModel.find()
        return carts
    }
    createCart = async() =>{
            const newCart = await cartModel.insertMany(); //TUVE QUE PONER .insertMany(), porque .create daba null
            return newCart
    }
    AddProduct = async(cartID,productID) =>{
        try{
            const product = await ManejadorDeProductos.getProduct(productID); //TIENEN QUE SER CADENA DE 24 SINO ERROR
            const cart = await cartModel.findOne({_id : cartID})
            let isAdd = false

            if((product === null)||(cart === null)){
                return (-1) //SI NO ESTA ME RETORNO CON -1
            }else{    
                cart.products.forEach((el) =>{
                    if(el.productID == productID){
                        el.quantity = el.quantity + 1 //ME ACTUALIZO LA CANTIDAD
                        isAdd = true;
                    }
                })

                if(isAdd){
                    await cartModel.updateOne({_id : cartID},cart) //ENVIO LO ACTUALIZADO
                }else{
                    cart.products.push({ 
                        productID: productID,
                        quantity : 1
                    })
                    await cartModel.updateOne({_id : cartID},cart)
                }
            }
        }catch(error){
            console.log(error)
        }
    }
    deleteCart = async(CartID) =>{
        try{
            await cartModel.deleteOne({_id : CartID})
        }catch(error){
            console.log(error)
        }
    }
}
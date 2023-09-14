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
    getCart = async(cID) =>{
        const cart = await cartModel.findOne({_id : cID}).lean();
        return cart

    }
    getNewCart = async()=>{
        const newCart = new cartModel()
        try {
          const data = await cartModel.create(newCart)
          return `Carrito generado con id: ${data._id}` 
        } catch (error) {
          return error
        }
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
                    if(el.productID._id == productID){
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
    deleteProduct = async(cID,productID) =>{
        try{
            const cart = await cartModel.findById({_id : cID});
            const eToDelete = cart.products.find(e => e.productID == productID); //ENCUENTRO EL ID DENTRO DEL ARRAY PRODUCTS
            if (eToDelete === undefined){
                return -1
            }
                cart.products.pull(eToDelete); //ELIMINO EL E A BORRAR Y ACTUALIZO CON SAVE
                await cart.save()
                return 1
        }catch(error){
            console.log(error)
        }
    }
}
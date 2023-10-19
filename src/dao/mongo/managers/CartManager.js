import { cartModel } from "../../../models/cart.js";
import { productModel } from "../../../models/product.js";

export default class CartManager{
    constructor(){
    }
    getCarts = async () => {
        const carts = await cartModel.find()
        return carts
    }
    getCart = async (cID) => {
        try{
            const cart = await cartModel.findOne({ _id: cID }).lean();
            return cart
        }catch(err){
            return err
        }
    }
    getNewCart = async () => {
        const newCart = new cartModel()
        try {
            const data = await cartModel.create(newCart)
            return data._id
        } catch (error) {
            return error
        }
    }
    addProduct = async (cID,pID) => {
        try {
            const product = await productModel.findOne({_id : pID}); //TIENEN QUE SER CADENA DE 24 SINO ERROR
            const cart = await cartModel.findOne({ _id: cID })
            let isAdd = false
    
            if ((product === null) || (cart === null)) {
                return null
            } else {
                    cart.products.forEach((el) => {
                        if (el.productID._id == pID) {
                            el.quantity = el.quantity + 1 //ME ACTUALIZO LA CANTIDAD
                            isAdd = true;
                        }
                    })
    
                if (isAdd) {
                    await cartModel.updateOne({ _id: cID }, cart) //ENVIO LO ACTUALIZADO
                } else {
                    cart.products.push({
                        productID: pID,
                        quantity: 1
                    })
                    await cartModel.updateOne({ _id: cID }, cart)
                }
                return cart
            }
        } catch (error) {
            return error
        }
    }
    deleteCart = async (cID) => {
        try {
            await cartModel.deleteOne({ _id: cID })
        } catch (error) {
            res.send({status:'error',message:error})
        }
    }
    deleteProduct = async (cID,pID) => {
        try {
            const cart = await cartModel.findById({ _id: cID });
            if(!cart){
                return false
            }
            const eToDelete = cart.products.find(e => e.productID._id == pID); //ENCUENTRO EL ID DENTRO DEL ARRAY PRODUCTS
            if (eToDelete === undefined) {
                return false
            }
            cart.products.pull(eToDelete); //ELIMINO EL E A BORRAR Y ACTUALIZO CON SAVE
            await cart.save()
            return true
        } catch (error) {
            return error
        }
    }
}
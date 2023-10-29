import { cartModel } from "../../../models/cart.js";
import { userModel } from "../../../models/user.js"
import { productModel } from "../../../models/product.js";
import { ticketModel } from "../../../models/ticket.js";
import { IDgenerator } from "../../../utils.js";

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
    purchase = async(cID) =>{
        const cart = await cartModel.findOne({_id: cID})
        const user = await userModel.findOne({cartID : cID}) // TRAIGO EL USER PARA OBTENER SU EMAIL Y DSP ADJUNTARLO EN TICKET
        const noStock = []; //ID NO COMPRADOS
        const purchases = []; //ID COMPRADOS
        let total = 0;
        for (const element of cart.products) {//UTILIZO FOR OF PORQUE FOREACH NO ADMITE FUNCIONES ASYN DENTRO
            const product = await productModel.findById({_id: element.productID._id})
                if(element.quantity > product.stock){
                    noStock.push(product._id)//ME GUARDO EL ID DE LOS PRODUCTOS CON STOCK MENORES AL DESEADO
                }else{
                    let newStock = product.stock - element.quantity
                    total += element.quantity*product.price
                    purchases.push(product._id)
                    await productModel.updateOne({_id:product._id},{stock:newStock})
                }
        }
        if((total <= 0) && (noStock.length > 0)){
            return noStock //COMPRA = 0, PERO PRODUCTOS SIN STOCK
        }
        if(total <= 0){
            return -1 // CARRITO VACIO
        }
        const order = {
            code: IDgenerator(),
            purchase_datatime: new Date().toString(),
            amount: total,
            purchaser: user.email
        }
        const newTicket = await ticketModel.create(order) //CREO EL TICKET
   
        if(purchases.length > 0){
            for (let i = 0; i < cart.products.length; i++) {
                for (let j = 0; j < purchases.length; j++) {
                    const idCart = cart.products[i].productID._id.toHexString()
                    const idPurchase = purchases[j].toHexString()//SE PARSEA YA QUE AMBOS SON PUNTEROS Y NUNCA SE RECONOCERAN COMO IGUALES SINO
                    if(idCart == idPurchase){
                        cart.products.splice(i,1)//SI COINCIDE EN I TENGO EL INDEX A BORRAR
                    }
                }
                
            }
        }
        await cartModel.updateOne({_id:cID},cart) // ACTUALIZO EL CARRITO

        if(noStock.length > 0){
            return noStock //SI HAY ALGUN ID DENTRO DE noStock LO RETORNO ASI EL CLIENTE SABE CUALES NO PUDO COMPRAR
        }

        return newTicket
    }
    getOwnerEmail = async(cID) =>{
        const user = await userModel.findOne({cartID : cID})
        return user.email

    }
}
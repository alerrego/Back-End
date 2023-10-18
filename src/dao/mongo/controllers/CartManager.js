import { cartModel } from "../models/cart.js";
import { productModel } from "../models/product.js";


export const getCarts = async (req,res) => {
    const carts = await cartModel.find()
    return res.send({status:'succes',payload:carts});
}
export const getCart = async (req,res) => {
    try{
        const cart = await cartModel.findOne({ _id: req.params.cID }).lean();
        return res.send({status:'succes',payload:cart});
    }catch(err){
        return res.status(404).send({status:"error", message:"Not found"})
    }
}
export const getNewCart = async (req,res) => {
    const newCart = new cartModel()
    try {
        const data = await cartModel.create(newCart)
        return res.send(data._id)
    } catch (error) {
        return res.status(500).send({status:'error'})
    }
}
export const AddProduct = async (req,res) => {
    try {
        const pID = req.params.pID;
        const cID = req.params.cID;
        const product = await productModel.findOne({_id : pID}); //TIENEN QUE SER CADENA DE 24 SINO ERROR
        const cart = await cartModel.findOne({ _id: cID })
        let isAdd = false

        if ((product === null) || (cart === null)) {
            return res.status(404).send(`The ID of cart:${cID} or ID of product:${pID} are incorrect`)
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
            return res.send({status: 'succes'+` The product of ID ${pID} is added in cart ${cID}`})
        }
    } catch (error) {
        console.log(error)
        return res.send({status:'error',message:error})
    }
}
export const deleteCart = async (req,res) => {
    try {
        await cartModel.deleteOne({ _id: req.params.cID })
        res.status(200).send({status:'success', message:`The Cart of ID ${req.params.cID} are deleted`})
    } catch (error) {
        res.send({status:'error',message:error})
    }
}
export const deleteProduct = async (req,res) => {
    try {
        const cart = await cartModel.findById({ _id: req.params.cID });
        const eToDelete = cart.products.find(e => e.productID._id == req.params.pID); //ENCUENTRO EL ID DENTRO DEL ARRAY PRODUCTS
        if (eToDelete === undefined) {
            return res.status(404).send(`ID CART OR ID PRODUCT ARE INCORRECT`)
        }
        cart.products.pull(eToDelete); //ELIMINO EL E A BORRAR Y ACTUALIZO CON SAVE
        await cart.save()
        return res.send({status:'success'+` product ${req.params.pID} delete.`})
    } catch (error) {
        res.send({status:'error',message:error})
    }
}
import { ManejadorDeCarritos } from "../dao/mongo/managers/index.js"

export default class CartController{
    constructor(){

    }
    getCarts = async() =>{
        const carts = await ManejadorDeCarritos.getCarts();
        return carts
    }
    getCart = async(cID) =>{
        const cart = await ManejadorDeCarritos.getCart(cID);
        return cart
    }
    getNewCart = async() =>{
        const newCartID = await ManejadorDeCarritos.getNewCart();
        return newCartID
    }
    addProduct = async(cID,pID) =>{
        const cart = await ManejadorDeCarritos.addProduct(cID,pID);
        return cart
    }
    deleteCart = async(cID) =>{
        await ManejadorDeCarritos.deleteCart(cID);
    }
    deleteProduct = async(cID,pID) =>{
        const isDelete = await ManejadorDeCarritos.deleteProduct(cID,pID)
        return isDelete
    }
}
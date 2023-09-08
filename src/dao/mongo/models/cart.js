import mongoose from "mongoose";

const cartsCollection = 'carts';
  
  // Definir el esquema del carrito
  const cartSchema = new mongoose.Schema({
    cartID : {
        type : mongoose.Types.ObjectId,
        default : new mongoose.Types.ObjectId
    },
    products : {
        type : Array,
        default : []
    }
})

export const cartModel = mongoose.model(cartsCollection,cartSchema);
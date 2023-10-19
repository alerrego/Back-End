import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const cartsCollection = 'carts';
  
  // Definir el esquema del carrito
  const cartSchema = new mongoose.Schema({
    products: [
        {
            productID: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "products"
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }
    ]
})

cartSchema.plugin(mongoosePaginate);

cartSchema.pre('findOne',function(){
    this.populate('products.productID')
})

export const cartModel = mongoose.model(cartsCollection,cartSchema);
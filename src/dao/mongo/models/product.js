import mongoose from 'mongoose';

const productsCollection = 'products';

const productSchema = new mongoose.Schema({
    title: {
        type : String,
        required : true
    },
    description: String,
    code : {
        type:String,
        required:true,
        unique:true
    },
    price : {
        type:Number,
        required:true
    },
    stock: Number,
    category: String,
    thumbnails: {
        type:Array,
        default: []
    }
});

export const productModel = mongoose.model(productsCollection,productSchema);
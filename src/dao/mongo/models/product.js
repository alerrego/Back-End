import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

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

productSchema.plugin(mongoosePaginate);

export const productModel = mongoose.model(productsCollection,productSchema);
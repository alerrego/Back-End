import { productModel } from "../models/product.js";

export default class ProductManager {
    constructor (){

    }
    getProducts = async(limit) =>{
        if(limit){
            const productsLimit = await productModel.find().limit(limit).lean()
            return productsLimit
        }else{
            const products = await productModel.find().lean()
            return products
        }
    }
    getProduct = async(id) =>{
        try{
            const product = await productModel.findOne({_id : id})
            return product
        }catch(error){
            throw error
        }
    }
    addProduct = async(data) =>{
        try{
           const product = await productModel.create(data)
           return product
        }catch(error){
            throw error
        }
    }
    updateProduct = async(id,data) =>{
        try{
            const product = await productModel.updateOne({_id : id},data) //PRIMERO PONGO LA COND DEL PROD A MODIFICAR Y DSP LA MODIFICIACION
            return product
         }catch(error){
             throw error
         }
    }
    deleteProduct = async(id) =>{
        try{
            const product = await productModel.deleteOne({_id : id}) //LE PASO EL ID A BORRAR
            return 
         }catch(error){
             throw error
         }
    }
}
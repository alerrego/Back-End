import { productModel } from "../models/product.js";

export default class ProductManager {
    constructor (){

    }
    getProducts = async(limit,page,sort,stock,category) =>{
        if(stock != 1){
            const productsStock = await productModel.paginate({stock:{$gte:stock}},{limit : limit,page: page,sort:{price:sort}})
            return productsStock
        }else if((category != undefined)&&(stock == 1)){
            const productsCategory = await productModel.paginate({category:{$eq:category}},{limit : limit,page: page,sort:{price:sort}})
            return productsCategory
        }
        else{
            const products = await productModel.paginate({},{limit : limit,page: page,sort:{price:sort}})
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
    addProducts = async(data) =>{
        try{
            const products = await productModel.insertMany(data)
            return products
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
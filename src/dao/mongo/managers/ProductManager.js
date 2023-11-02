import { productModel } from "../../../models/product.js";

export default class ProductManager{
    constructor(){

    }
    getProducts = async (limit, page, sort, stock, category) => {
        try {
            if (stock != 1) {
                const productsStock = await productModel.paginate({ stock: { $gte: stock } }, { limit: limit, page: page, sort: { price: sort } })
                return productsStock
            } else if ((category != undefined) && (stock == 1)) {
                const productsCategory = await productModel.paginate({ category: { $eq: category } }, { limit: limit, page: page, sort: { price: sort } })
                return productsCategory
            }
            else {
                const products = await productModel.paginate({}, { limit: limit, page: page, sort: { price: sort } })
                return products
            }
        } catch (error) {
            console.log(error)
        }
    }
    getProduct = async (pID) => {
        try {
            const product = await productModel.findOne({ _id: pID })
            return product
        } catch (error) {
            return error
        }
    }
    addProduct = async (data) => {
        try {
            const newProduct = await productModel.create(data)
            return newProduct
        } catch (error) {
            throw error
        }
    }
    addProducts = async (data) => {
        try {
            const newProducts = await productModel.insertMany(data)
            return newProducts
        } catch (error) {
            return error
        }
    }
    updateProduct = async (data,pID) => {
        try {
            const update = await productModel.updateOne({ _id: pID }, data) //PRIMERO PONGO LA COND DEL PROD A MODIFICAR Y DSP LA MODIFICIACION
            return update
        } catch (error) {
            return error
        }
    }
    deleteProduct = async (pID) => {
        try{
            const deleted = await productModel.deleteOne({ _id: pID }) //LE PASO EL ID A BORRAR
            return deleted
        }catch(error){
            return error
        }
    }
    
} 
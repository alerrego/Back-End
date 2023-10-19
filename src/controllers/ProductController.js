import { ManejadorDeProductos } from "../dao/mongo/managers/index.js"

export default class ProductController {
    constructor(){}
    getProducts = async(limit, page, sort, stock, category) => {
        const res = await ManejadorDeProductos.getProducts(limit, page, sort, stock, category)
        return res
    }
    
    getProduct = async(pID) => {
        const res = await ManejadorDeProductos.getProduct(pID)
        return res;
    }
    
    addProduct = async(data) => {
        if(!data){
            return -1
        }
        const newProduct = await ManejadorDeProductos.addProduct(data)
        return newProduct
    }
    
    addProducts = async(data) => {
        if(!data){
            return -1
        }
        const newProducts = await ManejadorDeProductos.addProducts(data)
        return newProducts
    }
    
    updateProduct = async(data,pID) =>{
        if(!data && !pID){
            return -1
        }
        const res = await ManejadorDeProductos.updateProduct(data,pID);
        return res;
    }
    
    deleteProduct = async(pID) =>{
        await ManejadorDeProductos.deleteProduct(pID);
    }    
}
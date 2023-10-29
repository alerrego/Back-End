import { ManejadorDeProductos } from "../dao/mongo/managers/index.js"
import ProductDTO from "../dao/DTOs/product.js";

export default class ProductController {
    constructor(){}
    getProducts = async (req, res) => {
        try {
            const limit = req.query.limit ?? 10; //SI NO RECIBO NADA LE ASIGNO EL VALOR DSP DEL ??
            const page = req.query.page ?? 1;
            const sort = req.query.sort ?? undefined;
            const stock = req.query.stock ?? 1; //SI REBIBO 1 MUESTRO TODOS LOS PRODUCTOS EN VENTA
            const category = req.query.category ?? undefined;
            const products = await ManejadorDeProductos.getProducts(limit, page, sort, stock, category)
            
            res.send({ status: 'success', payload: products })
        }
        catch (error) {
            res.status(500).send({ status: 'error' })
        }
    }
    getProduct = async (req, res) => {
        try {
            const pID = req.params.pID
            const product = await ManejadorDeProductos.getProduct(pID)
            if (!product) {
                return res.status(404).send({statu:"error",message:`ID ${pID} not found`})
            }
            const result = new ProductDTO(product)
            res.send({ status: 'success', payload: result })
        } catch (error) {
            res.status(500).send({ status: 'error' })
        }
    }
    addProduct =  async (req, res) => {
        try {
            const data = req.body
            const newProduct = await ManejadorDeProductos.addProduct(data)
            if (!newProduct) {
                return res.send({ status: "error", message: "data incorrect" })
            }
            res.send({ status: "succes", payload: newProduct })
        } catch (error) {
            res.status(500).send({ status: "error" })
        }
    }
    addProducts = async (req, res) => {
        try {
            const data = req.body
            const newProducts = await ManejadorDeProductos.addProducts(data)
            if (!newProducts) {
                return res.send({ status: "error", message: "data incorrect" })
            }
            res.send({ status: "succes", payload: newProducts })
        } catch (error) {
            res.status(500).send({ status: "error" })
        }
    }
    updateProduct = async (req, res) => {
        try {
            const pID = req.params.pID
            const data = req.body
            const update = await ManejadorDeProductos.updateProduct(data,pID);
            if (!update) {
                return res.send({ status: 'error', message: 'data incorrect' })
            }
            res.send({ status: 'success', payload: update })
        } catch (error) {
            res.status(500).send({status:'error'})
        }
    }
    deleteProduct = async (req, res) => {
        try{
            const pID = req.params.pID
            await ManejadorDeProductos.deleteProduct(pID)
            res.status.send({status:'success',message:`the product of ID ${pID} are delete`})
        }catch(error){
            res.status(500).send({status:"error"})
        }
    }
}
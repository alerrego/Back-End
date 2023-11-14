import { ManejadorDeProductos } from "../dao/mongo/managers/index.js"
import ProductDTO from "../dao/DTOs/product.js";
import { generateProducts } from "../utils.js"

//MANEJO ERRORES
import EnumerationErrors from "../services/errors/enum.js";
import CustomError from "../services/errors/CustomError.js";
import { createProductErrorInfo, getProductErrorInfo } from "../services/errors/info.js";

export default class ProductController {
    constructor() { }
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
    getMockingProducts = async (req, res) => {
        const products = generateProducts()
        if (!products) {
            return res.status(500).send({ status: 'error' })
        }
        res.send({ status: 'success', payload: products })
    }
    getProduct = async (req, res) => {
        try {
            const pID = req.params.pID
            const product = await ManejadorDeProductos.getProduct(pID)
            if (!product) {
                CustomError.createError({
                    name: 'ID NOT FOUND',
                    cause: getProductErrorInfo(pID),
                    message: 'error trying to search for the product',
                    code: EnumerationErrors.NOT_FOUND
                })
            }
            const result = new ProductDTO(product)
            res.send({ status: 'success', payload: result })
        } catch (error) {
            res.send({status:'error',error})
        }
    }
    addProduct = async (req, res) => {
        try {
            const data = req.body
            if (!data.title || !data.code || !data.description || !data.stock || !data.price || !data.thumbnails || !data.category) {
                CustomError.createError({
                    name: 'INVALID DATA ERROR',
                    cause: createProductErrorInfo(data),
                    message: "Error trying to create product",
                    code: EnumerationErrors.INVALID_TYPES_ERROR
                })
            }
            const newProduct = await ManejadorDeProductos.addProduct(data)
            if (!newProduct) {
                return res.send({ status: "error", message: "data incorrect" })
            }
            res.send({ status: "success", payload: newProduct })
        } catch (error) {
            res.send({ status: "error", error:error })
        }
    }
    addProducts = async (req, res) => {
        try {
            const data = req.body
            if (!data.title || !data.code || !data.description || !data.stock || !data.price || !data.thumbnails || !data.category) {
                CustomError.createError({
                    name: 'INVALID DATA ERROR',
                    cause: createProductErrorInfo(data),
                    message: "Error trying to create product",
                    code: EnumerationErrors.INVALID_TYPES_ERROR
                })
            }
            const newProducts = await ManejadorDeProductos.addProducts(data)
            if (!newProducts) {
                return res.send({ status: "error", message: "data incorrect" })
            }
            res.send({ status: "success", payload: newProducts })
        } catch (error) {
            res.status(500).send({ status: "error",error:error })
        }
    }
    updateProduct = async (req, res) => {
        try {
            const pID = req.params.pID
            const data = req.body
            const update = await ManejadorDeProductos.updateProduct(data, pID);
            if (!update) {
                return res.send({ status: 'error', message: 'data incorrect' })
            }
            res.send({ status: 'success', payload: update })
        } catch (error) {
            res.status(500).send({ status: 'error' })
        }
    }
    deleteProduct = async (req, res) => {
        try {
            const pID = req.params.pID
            const deleted = await ManejadorDeProductos.deleteProduct(pID)
            if (deleted.deletedCount == 0) {
                CustomError.createError({
                    name: 'ID NOT FOUND',
                    cause: getProductErrorInfo(pID),
                    message: 'error trying to search for the product',
                    code: EnumerationErrors.NOT_FOUND
                })
            }
            return res.send({ status: 'success', message: `the product of ID ${pID} are delete` })
        } catch (error) {
            res.status(500).send({ status: "error",error:error })
        }
    }
}
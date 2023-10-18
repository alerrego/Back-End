import { productModel } from "../models/product.js";

export const getProducts = async (req, res) => {
    try {
        const limit = req.query.limit ?? 10; //SI NO RECIBO NADA LE ASIGNO EL VALOR DSP DEL ??
        const page = req.query.page ?? 1;
        const sort = req.query.sort ?? undefined;
        const stock = req.query.stock ?? 1; //SI REBIBO 1 MUESTRO TODOS LOS PRODUCTOS EN VENTA
        const category = req.query.category ?? undefined;

        if (stock != 1) {
            const productsStock = await productModel.paginate({ stock: { $gte: stock } }, { limit: limit, page: page, sort: { price: sort } })
            return res.send({ status: 'succes', payload: productsStock })
        } else if ((category != undefined) && (stock == 1)) {
            const productsCategory = await productModel.paginate({ category: { $eq: category } }, { limit: limit, page: page, sort: { price: sort } })
            return res.send({ status: 'succes', payload: productsCategory })
        }
        else {
            const products = await productModel.paginate({}, { limit: limit, page: page, sort: { price: sort } })
            return res.send({ status: 'succes', payload: products })
        }
    } catch (error) {
        console.log(error)
    }
}
export const getProduct = async (req,res) => {
    try {
        const pID = req.params.pID;

        const product = await productModel.findOne({ _id: pID })
        return res.send({status:'success',payload:product})
    } catch (error) {
        return res.send({status:'error', message:error})
    }
}
export const addProduct = async (req,res) => {
    try {
        const newProduct = await productModel.create(req.body)
        return res.send({status:'succes',payload: newProduct})
    } catch (error) {
        throw res.status(500).send(error)
    }
}
export const addProducts = async (req,res) => {
    try {
        const newProducts = await productModel.insertMany(req.body)
        return res.send({status:'succes',payload: newProducts})
    } catch (error) {
        throw res.status(500).send(error)
    }
}
export const updateProduct = async (req,res) => {
    try {
        const update = await productModel.updateOne({ _id: req.params.pID }, req.body) //PRIMERO PONGO LA COND DEL PROD A MODIFICAR Y DSP LA MODIFICIACION
        return res.send({status:'succes',payload: update})
    } catch (error) {
        throw res.status(500).send(error)
    }
}
export const deleteProduct = async (req,res) => {
    try {
        const product = await productModel.deleteOne({ _id: req.params.pID }) //LE PASO EL ID A BORRAR
        return res.send({status:'succes'})
    } catch (error) {
        throw res.status(500).send(error)
    }
}
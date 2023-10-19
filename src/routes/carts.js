import { Router } from "express";
import { cartService } from "../controllers/index.js"
import { ManejadorDeCarritos } from "../dao/mongo/managers/index.js";


const router = Router();

router.get('/', async (req, res) => {
    try {
        const carts = await cartService.getCarts()
        res.send({ status: 'success', payload: carts })
    } catch (error) {
        res.status(500).send({ status: 'error' })
    }
})

router.get('/:cID', async (req, res) => {
    try {
        const cID = req.params.cID
        const cart = await cartService.getCart(cID)
        if (!cart) {
            return res.status(404).send({ status: 'error', message: `cart of ID: ${cID} not found` })
        }
        res.send({ status: 'success', payload: cart })
    }
    catch (error) {
        res.status(500).send({ status: 'error' })
    }
})

router.post('/', async (req, res) => {
    try {
        const cartID = await ManejadorDeCarritos.getNewCart()
        res.send({ status: 'success', payload: cartID })
    }
    catch (error) {
        res.status(500).send({ status: 'error' })
    }
})

router.put('/:cID/product/:pID', async (req, res) => {
    try {
        const cID = req.params.cID;
        const pID = req.params.pID;

        const cart = await ManejadorDeCarritos.addProduct(cID, pID);
        if (cart === null) {
            return res.status(404).send({ status: 'error', message: `The ID of cart ${cID} or ID of product ${pID} are incorrect` })
        }
        res.send({ status: 'succes', payload: cart })
    }
    catch (error) {
        res.status(500).send({ status: 'error' })
    }
})

router.delete('/:cID', async (req, res) => {
    try {
        const cID = req.params.cID
        await ManejadorDeCarritos.deleteCart(cID)
        res.send({ status: 'succes', message: `the cart of ID ${cID} are deleted` })
    } catch (error) {
        res.status(500).send({ status: 'error' })
    }
})

router.delete('/:cID/product/:pID', async (req, res) => {
    try {
        const cID = req.params.cID
        const pID = req.params.pID

        const isDelete = await ManejadorDeCarritos.deleteProduct(cID, pID)
        if (!isDelete) {
            return res.status(404).send({ status: 'error', message: `the ID of cart ${cID} or ID of product ${pID} are incorrect` })
        }
        res.send({ status: 'success' })
    }
    catch (error) {
        res.status(500).send({ status: 'error' })
    }
})

export default router
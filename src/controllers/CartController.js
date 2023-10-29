import { ManejadorDeCarritos } from "../dao/mongo/managers/index.js"
import {transport} from "../utils.js"
import config from "../config/config.js";

export default class CartController{
    constructor(){

    }
    getCarts = async(req,res) =>{
            try {
                const carts = await ManejadorDeCarritos.getCarts();
                res.send({ status: 'success', payload: carts })
            } catch (error) {
                res.status(500).send({ status: 'error' })
            }
    }
    getCart = async (req, res) => {
        try {
            const cID = req.params.cID
            const cart = await ManejadorDeCarritos.getCart(cID);
            if (!cart) {
                return res.status(404).send({ status: 'error', message: `cart of ID: ${cID} not found` })
            }
            res.send({ status: 'success', payload: cart })
        }
        catch (error) {
            res.status(500).send({ status: 'error' })
        }
    }
    
    getNewCart = async (req, res) => {
        try {
            const newCartID = await ManejadorDeCarritos.getNewCart();
            res.send({ status: 'success', payload: newCartID })
        }
        catch (error) {
            res.status(500).send({ status: 'error' })
        }
    }
    addProduct = async (req, res) => {
        try {
            const cID = req.params.cID;
            const pID = req.params.pID;
    
            const cart = await ManejadorDeCarritos.addProduct(cID,pID);
            if (cart === null) {
                return res.status(404).send({ status: 'error', message: `The ID of cart ${cID} or ID of product ${pID} are incorrect` })
            }
            res.send({ status: 'success', payload: cart })
        }
        catch (error) {
            res.status(500).send({ status: 'error' })
        }
    }
    
    deleteCart =  async (req, res) => {
        try {
            const cID = req.params.cID
            await ManejadorDeCarritos.deleteCart(cID)
            res.send({ status: 'succes', message: `the cart of ID ${cID} are deleted` })
        } catch (error) {
            res.status(500).send({ status: 'error' })
        }
    }
    deleteProduct = async (req, res) => {
        try {
            const cID = req.params.cID
            const pID = req.params.pID
    
            const isDelete = await ManejadorDeCarritos.deleteProduct(cID, pID)
            if (!isDelete) {
                return res.status(404).send({ status: 'error', message: `the ID of cart ${cID} or ID of product ${pID} are incorrect` })
            }
            res.send({status: 'success',message:`the product of ID ${pID} are deleted to cart of ID ${cID}`})
        }
        catch (error) {
            res.status(500).send({ status: 'error' })
        }
    }
    purchase = async(req,res) =>{
        try{
            const cID = req.params.cID;
            const result = await ManejadorDeCarritos.purchase(cID)
            if(result == -1){
                return res.send({status:"error",message:`the cart of ID ${cID} is empty`})
            }
            if(Array.isArray(result)){
                let mailIncomplete = await transport.sendMail({
                    from: config.mails_correo,
                    to: await ManejadorDeCarritos.getOwnerEmail(cID),
                    subject: "Incomplete purchase",
                    html:`<div>
                            <p>The products that are still in your cart could not be purchased, the others could</p>
                         </div>`,
                    attachments:[]
                })
                return res.send({status:'incomplete',message:"the ID´s of payload they do not have the necessary stock", payload:result})
            }
            let mailSuccess = await transport.sendMail({
                from: config.mails_correo,
                to: await ManejadorDeCarritos.getOwnerEmail(cID),//OJO CON UTILIZAR CORREOS QUE NO EXISTEN TIRA ERROR @YOPMAIL
                subject: 'Successful purchase',
                html:`<div>
                        <p>All desired products could be purchased</p>
                     </div>`,
                attachments:[]  
            })
            res.send({status:'success',payload:result})
        }catch(error){
            res.status(500).send({status: 'error'})
        }
    }
}
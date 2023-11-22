import {ManejadorDeUsuarios} from "../dao/mongo/managers/index.js"

export default class UserController{
    constructor(){}
    updatePremium = async(req,res) =>{
        const uID = req.params.uID

        const user = await ManejadorDeUsuarios.updatePremium(uID)

        if(!user){
            return res.send({status:'error',message:'User not found to update'})
        }
        res.send({status:'success',message:`The user or ID ${uID} update to premium role`})
    }
    updateUser = async(req,res) =>{
        const uID = req.params.uID
        
        const user = await ManejadorDeUsuarios.updateUser(uID)

        if(!user){
            return res.send({status:'error',message:'User not found to update'})
        }
        res.send({status:'success',message:`The user or ID ${uID} update to user role`})
    }
}
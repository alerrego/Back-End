import {ManejadorDeUsuarios} from "../dao/mongo/managers/index.js"

export default class UserController{
    constructor(){}
    updatePremium = async(req,res) =>{
        const uID = req.params.uID

        const user = await ManejadorDeUsuarios.updatePremium(uID)

        if(!user){
            return res.send({status:'error',message:'User not found to update'})
        }
        if(user == -1){
            return res.send({status:'error',message:"you are not verify"})
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
    uploadDocuments = async(req,res) =>{
        const uID = req.params.uID
        const files = req.files
        const uploadType = req.query.uploadType

        if(!req.query.uploadType){
            return res.send({status:'error',message:'you could not upload documents'})
        }
        const upload = await ManejadorDeUsuarios.uploadDocuments(uID,files,uploadType)

        if(!upload){
            return res.send({status:'error',messsage:'user ID are invalid'})
        }
        res.send({status:'sucess',message:'you uploaded documents'})
    }
}
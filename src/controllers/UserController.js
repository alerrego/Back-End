import {ManejadorDeUsuarios} from "../dao/mongo/managers/index.js"
import UserDTO from "../dao/DTOs/user.js"
import { transport } from "../utils.js"
import config from "../config/config.js"

export default class UserController{
    constructor(){}
    getUser = async(req,res) =>{
        const uID = req.params.uID
        const user = await ManejadorDeUsuarios.getUser(uID)
        if(!user){
            return res.status(404).send({status:'error',message:'User not found'})
        }
        res.status(200).send({status:"success",payload:user})
    }
    getUsers = async(req,res) =>{
        const users = await ManejadorDeUsuarios.getUsers()
        if(!users){
            return res.send({status:'error',message:'i can´t find users'})
        }
        const usersDTO = users.map(user =>{
            return new UserDTO(user)
        })
        res.send({status:'success',payload:usersDTO})
    }
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
    deleteUser = async(req,res) =>{
        const uID = req.params.uID

        const user = await ManejadorDeUsuarios.deleteUser(uID)

        if(!user){
           return res.send({status:'error',message:'ID not found'})
        }
        res.send({status:'success',message:'User deleted correctly'})
    }
    deleteInactives = async(req,res) =>{
        const inactives = await ManejadorDeUsuarios.deleteInactives()

        if(!inactives){
            res.send({status:'error',message:'you cant deleted inactive users'})
        }

        if(Array.isArray(inactives)){
            for (let index = 0; index < inactives.length; index++) {
                const element = inactives[index];
                let mail = await transport.sendMail({
                    from: config.mails_correo,
                    to: element,
                    subject: "You were eliminated",
                    html:`<div>
                            <p>We are contacting you to inform you that your account has been terminated due to inactivity for 2 days.</p>
                         </div>`,
                    attachments:[]
                })
                
            }
            req.logger.info("your deleted inactive users")}

        res.send({status:'success',message:'you deleted inactive users'})
    }
}
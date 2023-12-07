import { Router } from "express";
import passport from "passport";
import config from "../config/config.js";

import UserDTO from "../dao/DTOs/user.js";
import { userModel } from "../models/user.js";

import { generateToken , isValidPassword , createHash} from '../utils.js'

import {transport,generateTokenForgotPassword} from "../utils.js"


const router = Router();

router.post('/github', passport.authenticate('github',{scope:['user:email']}),async(req,res)=>{

})

router.get('/githubCallback',passport.authenticate('github',{failureRedirect:'/login'}),async(req,res)=>{
       const token = generateToken(req.user);
       res.cookie('tokenCookie',token,{httpOnly:true})
       res.redirect('/products')
})

router.post("/login", passport.authenticate('login',{failureRedirect: '/faillogin'}) , async(req,res) =>{
    if(!req.user)return res.status(400).send({status:'error',error:'invalid credentials'});

    if((req.user.email === config.adminName)){
     req.user.role = "admin"
     const token = generateToken(req.user);
     res.cookie('tokenCookie',token,{httpOnly:true})
     return res.send({status:'success',token:token,expires:"in 1 hour"})
     }
    const token = generateToken(req.user);
    res.cookie('tokenCookie',token,{httpOnly:true})
    res.send({status:'success',token:token,expires:"in 1 hour",cartID:req.user.cartID})
})

router.get('/faillogin',(req,res) =>{
    res.send({status:'error',message:'failed login'})
})

router.post("/register", passport.authenticate('register',{failureRedirect:'/failregister'}) ,async(req,res) =>{
    res.status(200).send({status:'success',message:'User register'})
})

router.get('/failregister',(req,res) =>{
    console.log('Failed strategy');
    res.status(400).send({error:'Failed'});
})

router.delete('/logOut', async(req,res) =>{
    req.user = null;
    res.clearCookie('tokenCookie');//ELIMINO EL TOKEN
    req.session.destroy(err => {
        if(!err){
            res.send({status:"success",message:"you are deslogued"})
        }else{
            res.send({status:'LogOut err',body:err})
        }
    })
})

router.get('/current',passport.authenticate('jwt',{session:false}),async(req,res) =>{
    const result = new UserDTO(req.user.user)
    req.user = result
    res.send({status:'success',payload:result})
})

router.post('/sendMailForgotPassword',async(req,res) =>{
    const emailToSend = req.body.email // RECIBO EL MAIL

    const user = await userModel.findOne({email : emailToSend})

    if(!user){
        return res.status(404).send({status:'error',message:`The user of email ${emailToSend} doesn´t exist`})
    }
    const {tokenPassword,expirationTokenTime} = generateTokenForgotPassword() //GENERO LOS DATOS

    user.tokenPassword = tokenPassword
    user.expirationTokenTime = expirationTokenTime // LE AGREGO LOS DATOS DEL TOKEN AL USUARIO PARA TENERLO EN LA BD

    await userModel.updateOne({email:emailToSend},user)

    let mailSend = await transport.sendMail({
        from: config.mails_correo,
        to: emailToSend,
        subject: "Change of password",
        html:`<div>
                <h3>Your recovery link is the following: </h3>
                <a>http://${req.headers.host}/resetPassword?tokenPassword=${tokenPassword}</a>
             </div>`,
        attachments:[]
    })
    res.send({status:'success',message:`The recovery email was sent correctly to ${emailToSend}`})
})

router.post('/changePassword',async(req,res) =>{
    const {newPassword,tokenPassword} = req.body
    const user = await userModel.findOne({tokenPassword:tokenPassword})
    
    if(isValidPassword(user,newPassword)){
        return res.send({status:'error',message:'Your password did not change'})//SI VALIDA PUSO LA MISMA CONTRASEÑA POR ENDE ERROR
    }
    const passwordHash = createHash(newPassword)

    user.password = passwordHash //LE ASIGNO LA NUEVA CONTRASEÑA
    
    user.tokenPassword = null
    user.expirationTokenTime = null 

    await userModel.updateOne({_id : user._id},user) // LO ACTUALIZO EN LA BD

    res.status(200).send({status:'success',message:'Your password was changed'})

})

export default router
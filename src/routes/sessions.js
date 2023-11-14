import { Router } from "express";
import passport from "passport";
import config from "../config/config.js";

import UserDTO from "../dao/DTOs/user.js";

import { generateToken ,authToken } from '../utils/utils.js'

import { currentAdmin,currentUser } from "../middlewares/auth.js";

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
    res.send({error:'failed login'})
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
    res.send(result)
})


export default router
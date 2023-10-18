import { Router } from "express";
import passport from "passport";

import { generateToken ,authToken } from '../utils.js'

const router = Router();

router.post('/github', passport.authenticate('github',{scope:['user:email']}),async(req,res)=>{

})

router.get('/githubCallback',passport.authenticate('github',{failureRedirect:'/login'}),async(req,res)=>{
    res.redirect('/products')
})

router.post("/login", passport.authenticate('login',{failureRedirect: '/faillogin'}) , async(req,res) =>{
    if(!req.user)return res.status(400).send({status:'error',error:'invalid credentials'});

    if((req.user.email === "adminCoder@coder.com")){
     const token = generateToken(req.user);
     return res.cookie('tokenCookie',token,{httpOnly:true}).status(200).send({status:'success'});
     }
    
    const token = generateToken(req.user);
    res.cookie('tokenCookie',token,{httpOnly:true}).status(200).send({status:'success'});
})

router.get('/faillogin',(req,res) =>{
    res.send({error:'failed login'})
})

router.post("/register", passport.authenticate('register',{failureRedirect:'/failregister'}) ,async(req,res) =>{
    res.send({status:'success',message:'User register'})
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
            res.send('You are deslogued')
        }else{
            res.send({status:'LogOut err',body:err})
        }
    })
})

router.get('/current',passport.authenticate('jwt',{session:false}),async(req,res) =>{
    res.send(req.user)
})

export default router
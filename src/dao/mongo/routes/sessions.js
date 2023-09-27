import { Router } from "express";
import passport from "passport";

const router = Router();

router.post('/github', passport.authenticate('github',{scope:['user:email']}),async(req,res)=>{

})

router.get('/githubCallback',passport.authenticate('github',{failureRedirect:'/login'}),async(req,res)=>{
    req.session.user = req.user;
    res.redirect('/products')
})

router.post("/login", passport.authenticate('login',{failureRedirect: '/faillogin'}) , async(req,res) =>{
   if(!req.user)return res.status(400).send({status:'error',error:'invalid credentials'});

   if((req.user.email === "adminCoder@coder.com")){
    req.session.user = {
        first_name : req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role: "admin"
    }
   return res.send({status:'succes',payload:req.session.user})
    }
   
   req.session.user = {
    first_name : req.user.first_name,
    last_name: req.user.last_name,
    age: req.user.age,
    email: req.user.email,
    role: req.user.role
   }
   res.status(200).send({status:'success',payload:req.session.user})  
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
    req.session.destroy(err => {
        if(!err){
            res.send('You are deslogued')
        }else{
            res.send({status:'LogOut err',body:err})
        }
    })
})

export default router
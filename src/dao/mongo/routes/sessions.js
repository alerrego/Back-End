import { Router } from "express";
import { userModel } from "../models/user.js";

const router = Router();

router.post("/login", async(req,res) =>{
    const {email,password} = req.body;
    const user = await userModel.findOne({email, password})
    if(!user){
        return res.status(400).send({status:'error',error:'incorrect data'})
    }

    if((email === "adminCoder@coder.com")&&(password === "adminCod3r123")){
        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: "admin"
        }
       return res.send({status:'succes',payload:req.session.user})
    }
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        role: user.role
    }
    res.send({status:'succes',payload:req.session.user})
})

router.post("/register", async(req,res) =>{
    const {email,password,last_name,first_name,age} = req.body;

    const exist = await userModel.findOne({email});

    if(exist){
        return res.status(400).send({status:'error',error:'email alredy used'})
    }

    const user = {
        first_name,
        last_name,
        email,
        age,
        password,
        role: "user"
    }

    let added = await userModel.create(user);

    res.status(200).send({status:'succes',message:'User registered'}) //NO ENVIO EL USER PORQUE MANDARIA LA CONTRASEÑA(DATO SENSIBLE)
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
import { Router } from "express";
import {productModel} from "../models/product.js";
import { userModel } from "../models/user.js";
import {ManejadorDeCarritos} from '../dao/mongo/managers/index.js'
import config from "../config/config.js";
import { currentUser, current } from "../middlewares/auth.js";

const router = Router();


router.get('/products',current,async(req,res) =>{
    const cID = req.user.cartID
    const page = req.query.page ?? 1;
    let role = "user";
    let isAdmin = false;

    const {docs,prevPage,nextPage,prevLink,nextLink,hasPrevPage,hasNextPage} = await productModel.paginate({},{limit:10,page:page,lean:true})

    if(req.user.email == config.adminName){
        role = "admin"
        isAdmin = true
    } 
    let user = {
        _id: req.user._id,
        first_name : req.user.first_name,
        last_name : req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role: role,
        cartID : req.user.cartID
    }

    res.render('products',{docs,prevPage,nextPage,page,prevLink,nextLink,hasPrevPage,hasNextPage,user,cID,isAdmin})

})

router.get('/cart/:cID',current,async(req,res) =>{
    const cID = req.params.cID
    const cartToView = await ManejadorDeCarritos.getCart(cID)
    const products = cartToView.products
    
    res.render('cart',{products,cID})
})

router.get('/cart/:cID/product/:pID',current,async(req,res) =>{
    const cID = req.params.cID
    const pID = req.params.pID
    await ManejadorDeCarritos.addProduct(cID,pID)
    const page = req.query.page ?? 1;
    let role = "user"
    let isAdmin = false

    const {docs,prevPage,nextPage,prevLink,nextLink,hasPrevPage,hasNextPage} = await productModel.paginate({},{limit:10,page:page,lean:true})

    if(req.user.email == config.adminName){
        role = "admin"
        isAdmin = true
    } 
    let user = {
        first_name : req.user.first_name,
        last_name : req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role: role,
        cartID : req.user.cartID
    }

    res.render('products',{docs,prevPage,nextPage,page,prevLink,nextLink,hasPrevPage,hasNextPage,user,cID,isAdmin})
})

router.get('/purchase/:cID',current,async(req,res) =>{
    const cID = req.params.cID;
    const ticketData = await ManejadorDeCarritos.purchase(cID)
    if(ticketData == -1){
        return res.render('cart-empty')
    }
    if(Array.isArray(ticketData)){
        return res.render('incomplete-purchase',{ticketData})   
    }
    const code = ticketData.code
    const date = ticketData.purchase_datatime
    const amount = ticketData.amount
    const purchaser = ticketData.purchaser
    res.render('complete-purchase',{code,date,amount,purchaser})
})

router.get('/delete/cart/:cID/product/:pID',async(req,res) =>{
    const cID = req.params.cID
    const pID = req.params.pID
    const result = await ManejadorDeCarritos.deleteProduct(cID,pID)

    const cartToView = await ManejadorDeCarritos.getCart(cID)
    const products = cartToView.products
    
    res.render('cart',{products,cID})
})

router.get('/adminPanel',current,async(req,res) =>{
    res.render('adminPanel')
})


router.get('/realTimeProducts',current,async(req, res) => {
    res.render('realTimeProducts')
})


router.get("/chat",currentUser,(req, res) => {
    res.render("chat");
  })

router.get('/login',async(req,res) =>{
    res.render("login")
})
router.get('/',async(req,res) =>{
    res.render("login")
})

router.get('/register',async(req,res) =>{
    res.render("register")
})

router.get('/changePassword',async(req,res) =>{
    res.render('changePassword')
})

router.get('/resetPassword',async(req,res) =>{
    const tokenPassword = req.query.tokenPassword //LO RECIBO POR QUERY PARAMS 
    const user = await userModel.findOne({tokenPassword : tokenPassword})
    if(!user){
        return res.status(404).render('changePassword')
    }
    if(Date.now() > user.expirationTokenTime){ //COMPARO LA HORA CON EL TOKEN ENVIADO
        return res.status(404).render('changePassword')
    }
    res.render('resetPassword-form')
})
export default router;

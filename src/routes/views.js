import { Router } from "express";
import {productModel} from "../models/product.js";
import {ManejadorDeCarritos} from '../dao/mongo/managers/index.js'
import config from "../config/config.js";
import { currentUser, currentAdmin, current } from "../middlewares/auth.js";

const router = Router();


router.get('/products',current,async(req,res) =>{
    const cID = req.user.cartID
    const page = req.query.page ?? 1;
    let role = "user"

    const {docs,prevPage,nextPage,prevLink,nextLink,hasPrevPage,hasNextPage} = await productModel.paginate({},{limit:10,page:page,lean:true})

    if(req.user.email == config.adminName) role = "admin"
    let user = {
        first_name : req.user.first_name,
        last_name : req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role: role,
        cartID : req.user.cartID
    }

    res.render('products',{docs,prevPage,nextPage,page,prevLink,nextLink,hasPrevPage,hasNextPage,user,cID})

})

router.get('/cart/:cID',async(req,res) =>{
    const cID = req.params.cID
    const cartToView = await ManejadorDeCarritos.getCart(cID)
    const products = cartToView.products
    
    res.render('cart',{products,cID})
})

router.get('/cart/:cID/product/:pID',async(req,res) =>{
    const cID = req.params.cID
    const pID = req.params.pID
    await ManejadorDeCarritos.addProduct(cID,pID)
    const page = req.query.page ?? 1;
    let role = "user"

    const {docs,prevPage,nextPage,prevLink,nextLink,hasPrevPage,hasNextPage} = await productModel.paginate({},{limit:10,page:page,lean:true})

    if(req.user.email == config.adminName) role = "admin"
    let user = {
        first_name : req.user.first_name,
        last_name : req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role: role,
        cartID : req.user.cartID
    }

    res.render('products',{docs,prevPage,nextPage,page,prevLink,nextLink,hasPrevPage,hasNextPage,user,cID})
})

router.get('/realTimeProducts',current,async(req, res) => {
    res.render('realTimeProducts')
})


router.get("/chat",currentUser,(req, res) => {
    res.render("chat");
  })

router.get('/login',async(req,res) =>{
    res.render('login')
})
router.get('/',async(req,res) =>{
    res.render('login')
})

router.get('/register',async(req,res) =>{
    res.render("register")
})

export default router;

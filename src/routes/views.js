import { Router } from "express";
import {productModel} from "../models/product.js";
import config from "../config/config.js";
import { currentUser, currentAdmin } from "../middlewares/auth.js";

const router = Router();


const publicAcces = (req,res,next) => {
    if(req.user){
        return res.redirect('/')
    }
    next();
}

const privateAcces = (req,res,next) => {
    if(!req.user){
        return res.redirect('/login')
    }
    next();
}


router.get('/products',privateAcces,async(req,res) =>{

    const page = req.query.page ?? 1;
    let role = "user"

    const {docs,prevPage,nextPage,prevLink,nextLink,hasPrevPage,hasNextPage} = await productModel.paginate({},{limit:10,page:page,lean:true})

    if(req.user.email == config.adminName) role = "admin"
    let user = {
        first_name : req.user.first_name,
        last_name : req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role: role
    }

    res.render('products',{docs,prevPage,nextPage,page,prevLink,nextLink,hasPrevPage,hasNextPage,user})

})

router.get('/cart/:cID',privateAcces,async(req,res) =>{
    const cart = await getCart();
    res.render('cart',{cart})
})

router.get('/realTimeProducts',privateAcces,async(req, res) => {
    res.render('realTimeProducts')
})


router.get("/chat",currentUser,(req, res) => {
    res.render("chat");
  })

router.get('/login',publicAcces,async(req,res) =>{
    res.render('login')
})
router.get('/',publicAcces,async(req,res) =>{
    res.render('login')
})

router.get('/register',publicAcces,async(req,res) =>{
    res.render("register")
})

export default router;

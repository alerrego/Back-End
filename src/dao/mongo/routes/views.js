import { Router } from "express";
import {productModel} from "../models/product.js";
import CartManager from "../classes/CartManager.js";

const router = Router();

const ManejadorDeCarritos = new CartManager()

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

    const {docs,prevPage,nextPage,prevLink,nextLink,hasPrevPage,hasNextPage} = await productModel.paginate({},{limit:10,page:page,lean:true})

    let user = {
        first_name : req.user.first_name,
        last_name : req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role: req.user.role
    }

    res.render('products',{docs,prevPage,nextPage,page,prevLink,nextLink,hasPrevPage,hasNextPage,user})

})

router.get('/cart/:cID',privateAcces,async(req,res) =>{
    const cID = req.params.cID;
    const cart = await ManejadorDeCarritos.getCart(cID);
    res.render('cart',{cart})
})

router.get('/realTimeProducts',privateAcces,async(req, res) => {
    res.render('realTimeProducts')
})


router.get("/chat",publicAcces,(req, res) => {
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

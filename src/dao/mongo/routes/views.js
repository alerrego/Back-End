import { Router } from "express";
import {productModel} from "../models/product.js";
import CartManager from "../classes/CartManager.js";

const router = Router();

const ManejadorDeCarritos = new CartManager()


router.get('/products', async(req,res) =>{

    const page = req.query.page ?? 1;

    const {docs,prevPage,nextPage,prevLink,nextLink,hasPrevPage,hasNextPage} = await productModel.paginate({},{limit:10,page:page,lean:true})

    res.render('products',{docs,prevPage,nextPage,page,prevLink,nextLink,hasPrevPage,hasNextPage})

})

router.get('/cart/:cID', async(req,res) =>{
    const cID = req.params.cID;
    const cart = await ManejadorDeCarritos.getCart(cID);
    res.render('cart',{cart})
})

router.get('/realTimeProducts', async(req, res) => {
    res.render('realTimeProducts')
})


router.get("/chat", (req, res) => {
    res.render("chat");
  })

export default router;

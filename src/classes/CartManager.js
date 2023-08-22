import fs from 'fs'
import ProductManager from '../classes/ProductManager.js'

const ManejadorDeProductos = new ProductManager('products.json')

export default class CartManager {
    constructor (path) {
        this.path = path
    }
    getCarts = async() =>{
    try{   
        if(fs.existsSync(this.path)){
            const carts = await fs.promises.readFile(this.path,'utf-8') //SI EXISTE LO LEO Y RETORNO, SINO ARRAY VACIO
            return (JSON.parse(carts))
        }else{
            return []
        }

    }catch(error){
        console.error(error)
    }
    };
    createCart = async() =>{
        try{
        const carts = await this.getCarts(); // ME TRAIGO EL ARRAY PARA PODER SACAR EL ID DEL NUEVO Y NO PISAR VALORES
        let id = 0
        
        if(carts.length === 0){
            id = 1;
        }
        else{
        carts.forEach(cart => {
            if(cart.id > id){
                id = cart.id
            }
        });
        id += 1}

        let cart = {
            id : id,
            products : []
        }

        carts.push(cart)

        await fs.promises.writeFile(this.path,JSON.stringify(carts))

    }catch(err){
        console.error(err)
    }
    };
    getCartProducts = async(id) => {
        const carts = await this.getCarts();
        const result = carts.find((objeto) => objeto.id === id);
        if(result){
            const products = result.products
            return (products)
        }else{
            return -1
        }
    };
    addProduct = async(cartID,productID) =>{
        const carts = await this.getCarts();
        const cartProducts = await this.getCartProducts(cartID); //OBTENGO ARRAY NO VERIFICO SI EXISTE X LO HICE EN ROUTES

        const exist = await ManejadorDeProductos.idExist(productID) // ME RETORNA TRUE O FALSE

        if(exist){
            let isAdd = false;
            cartProducts.forEach(el => {
                if(el.productID === productID){
                    el.quantity += 1;
                    isAdd = true; //CAMBIO VALOR PARA NO AGREGAR 2 VECES
                }
            })
            if(isAdd === false){
                cartProducts.push({
                    productID : productID,
                    quantity: 1
                })
            }
        }else{
            return -1
        }

        const indexCart = carts.findIndex((cart) => cart.id === cartID);

        carts[indexCart].products = cartProducts; // ACTUALIZO EL ARRAY CON LO PUSHEADO ANTERIORMENTE
    
        await fs.promises.writeFile(this.path,JSON.stringify(carts))
        
    };
    deleteCart = async(cartID) =>{
        const carts = await this.getCarts();
        const indexCart = carts.findIndex((cart) => cart.id === cartID)

        if(indexCart == -1){
            return -1
        }

        carts.splice(indexCart,1)

        await fs.promises.writeFile(this.path,JSON.stringify(carts))
    }       
}

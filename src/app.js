import ProductManager from './classes/ProductManager.js'
import express from 'express'

const app = express()
app.use(express.urlencoded({extended:true}))

const ControladorDeProductos = new ProductManager('products.json')



app.get('/',(req,res) => {
    res.send('Mensaje desde el server')
})

app.get('/products', async (req,res) => {
    const products = await ControladorDeProductos.getProducts() // OBTENGO LOS PRODUCTOS USO AWAIT PARA RESOLVER LA PROMISE
    
    let limit = req.query.limit //RECIBO EL LIMITE POR QUERY Y LO ALMACENO 

    if (!limit){
        res.send(products) //SI NO EXISTE EL LIMITE RECIBIDO RETORNO LA TOTALIDAD DE LOS PRODUCTOS
        return
    }

    res.send(products.slice(0,limit)) //USO SLICE Y LE MANDO LA POS 0 INICIO ARRAY Y EL LIMITE DEL QUERY

})

app.get('/products/:pid', async(req,res) => {
    let paramId = +req.params.pid; // LE AGREGO EL + PARA PASARLO A ENTERO Y ASI PODER COMPARAR NUMEROS Y NO UN STRING

    const product = await ControladorDeProductos.getProductById(paramId);

    if(!product){
        res.send(`No se encontro el ID ${paramId}`)
        return
    }

    res.send(product)

})

app.listen(8080, () =>{
    console.log('En linea desde el puerto 8080')
})








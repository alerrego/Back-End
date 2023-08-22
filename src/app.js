import express from 'express';

import productRouter from './routes/products.js';
import cartRouter from './routes/carts.js';
import viewRouter from './routes/views.js';

import handlebars from 'express-handlebars';
import __dirname from './utils.js';

import { Server } from 'socket.io';
import ProductManager from './classes/ProductManager.js';

const app = express()

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname+'/public'));

app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine', 'handlebars');

app.use('/api/products' , productRouter);
app.use('/api/carts', cartRouter);
app.use('/',viewRouter);

const server = app.listen(8080, () =>{
    console.log('En linea desde el puerto 8080')
})

const ControladorDeProductos = new ProductManager(__dirname+"/data/products.json")

const io = new Server(server);

io.on('connection', async(socket) =>{
    console.log('a user connected')
    const products = await ControladorDeProductos.getProducts()
    socket.emit('productos', products);

    socket.on('addProduct', async data => {
        await ControladorDeProductos.addProduct(data)
        const updatedProducts = await ControladorDeProductos.getProducts() // Obtener la lista actualizada de productos
    socket.emit('update', updatedProducts);
      });

    socket.on("deleteProduct", async (id) => {
        const deletedProduct = await ControladorDeProductos.deleteProduct(id)
        const updatedProducts = await ControladorDeProductos.getProducts()
        socketServer.emit("update", updatedProducts);
      });
})

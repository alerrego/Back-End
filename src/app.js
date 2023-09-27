import express from 'express';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import session from 'express-session';


import productRouter from '../src/dao/mongo/routes/products.js'
import cartRouter from '../src/dao/mongo/routes/carts.js'
import viewsRouter from '../src/dao/mongo/routes/views.js'
import sessionRouter from '../src/dao/mongo/routes/sessions.js'

import handlebars from 'express-handlebars';
import __dirname from './utils.js';

import { Server } from 'socket.io';
import ProductManager from '../src/dao/mongo/classes/ProductManager.js'
import MessageManager from '../src/dao/mongo/classes/MessageManager.js'

import passport from 'passport';
import initializePassport from './config/passport.js';

const app = express()

//LOGIN
app.use(cookieParser());
app.use(session({
  store: MongoStore.create({
    mongoUrl: "mongodb+srv://Rego:123@cluster0.h8wbe8w.mongodb.net/ecommerce",
    mongoOptions: {
      useNewUrlParser:true,
    },
    ttl:1000
  }),
  secret:"asd123",
  resave:false,
  saveUninitialized:false
}))

//PASSPORT
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname+'/public'));

//CONFIGURACION HANDLEBARS
app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine', 'handlebars');

//RUTAS
app.use('/api/products' , productRouter);
app.use('/api/carts', cartRouter);
app.use('/', viewsRouter)
app.use('/api/sessions',sessionRouter)

const server = app.listen(8080, () =>{
    console.log('En linea desde el puerto 8080')
})


//MONGOOSE
mongoose.connect('mongodb+srv://Rego:123@cluster0.h8wbe8w.mongodb.net/ecommerce')
const ControladorDeProductos = new ProductManager()
const ControladorDeMensajes = new MessageManager()

const io = new Server(server);


io.on('connection', async(socket) =>{
    console.log('a user connected')
    const products = await ControladorDeProductos.getProducts()
    socket.emit('productos', products);

    //REAL TIME PRODUCTS
    socket.on('addProduct', async data => {
        await ControladorDeProductos.addProduct(data)
        const updatedProducts = await ControladorDeProductos.getProducts() // Obtener la lista actualizada de productos
    socket.emit('update', updatedProducts);
      });

      socket.on("deleteProduct", async (id) => {
        await ControladorDeProductos.deleteProduct(id)
        //obtengo todos los productos nuevamente
        const products = await ControladorDeProductos.getProducts();
        socket.emit("realTimeProducts", products);
      });
      //CHAT
      socket.on("newChatUser", (data) => {
        socket.broadcast.emit("newChatUser", data + " has joined the chat");
      });
    
      socket.on("newMessage", async (data) => {
        await ControladorDeMensajes.createMessage(data);
        const messages = await ControladorDeMensajes.getMessages();
        io.emit("messages", messages);
      });
}) 

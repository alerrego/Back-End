import express from 'express';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import session from 'express-session';


import productRouter from './routes/products.js'
import cartRouter from './routes/carts.js'
import viewsRouter from './routes/views.js'
import sessionRouter from './routes/sessions.js'

import handlebars from 'express-handlebars';
import __dirname from './utils.js';

import { Server } from 'socket.io';
import MessageManager from '../src/dao/mongo/controllers/MessageManager.js'

import passport from 'passport';
import initializePassport from './config/passport.js';

import config from './config/config.js';


const app = express()

//LOGIN
app.use(cookieParser());
app.use(session({
  store: MongoStore.create({
    mongoUrl: config.mongoUrl,
    mongoOptions: {
      useNewUrlParser:true,
    },
    ttl:1000
  }),
  secret:"SecretCookie",
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

const server = app.listen(config.port, () =>{
    console.log('En linea desde el puerto '+config.port)
})


//MONGOOSE
mongoose.connect(config.mongoUrl)
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

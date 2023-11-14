import express from 'express';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import compression from 'express-compression'


import productRouter from './routes/products.js'
import cartRouter from './routes/carts.js'
import viewsRouter from './routes/views.js'
import sessionRouter from './routes/sessions.js'
import loggerRouter from './routes/logger.js'

import handlebars from 'express-handlebars';
import __dirname from './utils/utils.js';

import { Server } from 'socket.io';
import MessageManager from '../src/dao/mongo/managers/MessageManager.js'

import passport from 'passport';
import initializePassport from './config/passport.js';

import cors from "cors"

import config from './config/config.js';
import {ManejadorDeProductos} from "./dao/mongo/managers/index.js"

import { addLogger } from './utils/logger.js';


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

//CORS
app.use(cors())

//LOGGER
app.use(addLogger)

//COMPRESSION
app.use(compression())//SE PUEDE AGREGAR BROTLI TAMBIEN

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
app.use('/',loggerRouter)

const server = app.listen(config.port, () =>{
    console.log('En linea desde el puerto '+config.port)
})


//MONGOOSE
mongoose.connect(config.mongoUrl)
const ControladorDeMensajes = new MessageManager()

const io = new Server(server);

let messages = [];

io.on('connection', async(socket) =>{
    console.log('a user connected')
    const products = await ManejadorDeProductos.getProducts()
    socket.emit('productos', products);

    //REAL TIME PRODUCTS
    socket.on('addProduct', async data => {
        await ManejadorDeProductos.addProduct(data)
        const updatedProducts = await ManejadorDeProductos.getProducts() // Obtener la lista actualizada de productos
    socket.emit('update', updatedProducts);
      });

      socket.on("deleteProduct", async (id) => {
        await ManejadorDeProductos.deleteProduct(id)
        //obtengo todos los productos nuevamente
        const products = await ManejadorDeProductos.getProducts()
        socket.emit("realTimeProducts", products);
      });
      //CHAT
      socket.on('message', data => {
        messages.push(data);
        io.emit('messageLogs', messages);
    })

    socket.on('authenticated', data=> {
        socket.broadcast.emit('newUserConnected', data);
    })
})

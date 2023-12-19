import { fileURLToPath } from 'url';
import { dirname } from 'path'

const __fileName = fileURLToPath(import.meta.url);
const __dirname = dirname(__fileName);


export default __dirname;

import bcrypt from 'bcrypt'

export const createHash = (password) => bcrypt.hashSync(password,bcrypt.genSaltSync(10));

export const isValidPassword = (user,password) => bcrypt.compareSync(password,user.password);

import jwt from "jsonwebtoken";
import config from './config/config.js';

export const generateToken = (user) =>{
    const token = jwt.sign({user},config.privateKeyJWT,{expiresIn:"1h"});
    return token;
}

export const authToken = (req,res,next) =>{
    
}

//AUTOGENERADOR ID PARA CODIGO DE TICKET
export const IDgenerator = () =>{
    let a = Date.now().toString(30)
    let b = Math.random().toString(30).substring(2)
    return (a+b)
}

//mails
import nodemailer from "nodemailer"

export const transport = nodemailer.createTransport({
    service : "gmail",
    port: 587,
    auth: {
        user: config.mails_correo,
        pass: config.mails_password
    }
})

//FAKER MOCKS

import { faker } from '@faker-js/faker';

export const generateProducts = () =>{
    let numOfProducts =  100
    let products = []
    for (let index = 0; index < numOfProducts; index++) {
        const product = {
            title : faker.commerce.productName(),
            description : faker.commerce.productDescription(),
            code : IDgenerator(),
            price: faker.commerce.price(),
            stock: Math.floor(Math.random()*1000-100+100),
            category:faker.commerce.productAdjective(),
            _id: faker.database.mongodbObjectId(),
            thumbnails:faker.image.url()
        }
        products.push(product)
    }
    return products
}

import crypto from "crypto"

export const generateTokenForgotPassword = () =>{
    const tokenPassword = crypto.randomBytes(20).toString('hex')
    const expirationTokenTime = Date.now() + 3600000;
    return {tokenPassword,expirationTokenTime}
}

//MULTER
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,`${__dirname}/public/${req.query.uploadType}`)
    },
    filename: function(req,file,cb){
    cb(null, `${file.originalname}`);
    }
})

export const uploader = multer({storage}).array('uploadedFiles')
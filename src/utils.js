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
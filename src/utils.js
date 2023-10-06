import { fileURLToPath } from 'url';
import { dirname } from 'path'

const __fileName = fileURLToPath(import.meta.url);
const __dirname = dirname(__fileName);


export default __dirname;

import bcrypt from 'bcrypt'

export const createHash = (password) => bcrypt.hashSync(password,bcrypt.genSaltSync(10));

export const isValidPassword = (user,password) => bcrypt.compareSync(password,user.password);

import jwt from "jsonwebtoken";

const PRIVATE_KEY = "secretKey";

export const generateToken = (user) =>{
    const token = jwt.sign({user},PRIVATE_KEY,{expiresIn:"1h"});
    return token;
}

export const authToken = (req,res,next) =>{
    
}
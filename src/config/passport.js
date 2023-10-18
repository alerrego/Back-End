import passport from "passport";
import local from 'passport-local';
import { userModel } from "../dao/mongo/models/user.js";
import { cartModel } from "../dao/mongo/models/cart.js";
import { createHash , isValidPassword } from "../utils.js";

import GitHubStrategy from 'passport-github2';

import jwt from "passport-jwt";
const JWTStrategy = jwt.Strategy;
const extractJWT = jwt.ExtractJwt;

const LocalStrategy = local.Strategy;

const initializePassport = () =>{

    //JWT STRATEGY
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: extractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: 'secretKey',
    },async(jwt_payload,done) =>{
        try{
            return done(null,jwt_payload)
        }catch(err){
            return done(err)
        }
    }))

    //GITHUB STRATEGY
    passport.use('github',new GitHubStrategy({
        clientID:'Iv1.a74839f5fa714606',
        clientSecret:'6ca3bc375552564da9a7353006b71d49f7550106',
        callbackURL:'http://localhost:8080/api/sessions/githubCallback'
    },async(accesToken,refreshToken,profile,done)=>{
        try{
            console.log(profile);
            let user = await userModel.findOne({email:profile._json.email});
            let newUser = {
                first_name : profile.displayName,
                last_name: '',
                age : 18,
                email: profile._json.email,//email llega como null(a lo mejor dato sensible que no da github)
                password : '',
                role:'user'
            }
            let res = await userModel.create(newUser);
            done(null,res)
        }catch(err){
            done(err)
        }
    }))

    //LOCAL STRATEGYS
    passport.use('register', new LocalStrategy({
        passReqToCallback : true,
        usernameField: 'email'
    },async(req,username,password,done)=>{
        const {first_name,last_name,email,age} = req.body;
        try{
            let user = await userModel.findOne({email:username});
            if(user){
                console.log('Email alredy used');
                return done(null,false)
            }
            const newCart = new cartModel();
            let cart = await cartModel.create(newCart);
            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password : createHash(password),//LE HASHEO EL PASSWORD 
                cartID: cart._id//LE CREO Y ASIGNO UN CART PROPIO AL USUARIO
            }
            let res = await userModel.create(newUser);
            return done(null,res)
        }catch(err){
            return done('Error getting user: '+err);
        }
    }));

    passport.use('login',new LocalStrategy({usernameField:'email'},async(email,password,done)=>{
        try{
            const user = await userModel.findOne({email : email}).lean();
            if(!user){
                console.log('User doesn´t exist');
                return done(null,false)
            }
            if(!isValidPassword(user,password)){
                return done(null,false)
            }
            return done(null,user)
        }catch(err){
            return done(err)
        }
    }))

    passport.serializeUser((user,done) =>{
        done(null,user._id)
    })
    passport.deserializeUser(async(id,done) =>{
        let user = await userModel.findById(id);
        done(null,user)
    })
}

const cookieExtractor = req =>{
    let token = null;
    if(req && req.cookies){
        token = req.cookies['tokenCookie']
    }
    return token
}

export default initializePassport;
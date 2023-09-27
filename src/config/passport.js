import passport from "passport";
import local from 'passport-local';
import { userModel } from "../dao/mongo/models/user.js";
import { createHash , isValidPassword } from "../utils.js";
import GitHubStrategy from 'passport-github2'

const LocalStrategy = local.Strategy;

const initializePassport = () =>{
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
            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password : createHash(password),
                role: "user"
            }
            let res = await userModel.create(newUser);
            return done(null,res)
        }catch(err){
            return done('Error getting user: '+err);
        }
    }));

    passport.use('login',new LocalStrategy({usernameField:'email'},async(email,password,done)=>{
        try{
            const user = await userModel.findOne({email : email});
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

export default initializePassport;
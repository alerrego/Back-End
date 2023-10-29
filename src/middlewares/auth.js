import config from "../config/config.js"

export const currentAdmin = (req,res,next) => {
    if(!req.user || req.user == undefined){
        return res.status(401).send({status:'error',message:'not logged in'})
    }
    if(req.user.email == config.adminName){
        next()
    }
    else{
        res.status(401).send({status:'error',message:'Unauthorized'})
    }
}

export const currentUser = (req,res,next) => {
    if(!req.user || req.user == undefined){
        return res.status(401).send({status:'error',message:'not logged in'})
    }
    if(req.user.role == "user" && req.user.email != config.adminName){
        next()
    }
    else{
        res.status(401).send({status:'error',message:'Unauthorized'})
    }
}
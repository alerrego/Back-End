import config from "../config/config.js"
import jwt from 'jsonwebtoken'

export const currentAdmin = (req,res,next) => {
    let token
    const tokenBearer = req.headers.authorization;
    const tokenCookie = req.cookies.tokenCookie;  // LO DEJO RECIBIR COOKIES POR SI NECESITO CONSULTAR EN NAVEGADOR
    if (tokenBearer) {
        token = tokenBearer.split(' ')[1];//LE SACO LA PRIMER PALABRA "Bearer", asi solo obtengo el token.
    }
    else if(tokenCookie){
        token = tokenCookie // Lo pongo asi ya que en las cookies no tienen "Bearer."
    }
    else if(!tokenBearer && !tokenCookie){
        return res.status(401).json({status:'error',message:"token not received"});
    }
    jwt.verify(token, config.privateKeyJWT, (err, decoded) => {
      if (err) {
        return res.status(401).json({status:'error',message:'invalid token'});
      } else {
        if(decoded.user.role == "admin" && decoded.user.email == config.adminName){//decoded datos del token
            next()
        }
        else{
            return res.status(401).send({status:'error',message:'Unauthorized'})
        }
      }
    });
}

export const currentUser = (req,res,next) => {
    let token
    const tokenBearer = req.headers.authorization;
    const tokenCookie = req.cookies.tokenCookie;  // LO DEJO RECIBIR COOKIES POR SI NECESITO CONSULTAR EN NAVEGADOR
    if (tokenBearer) {
        token = tokenBearer.split(' ')[1];//LE SACO LA PRIMER PALABRA "Bearer", asi solo obtengo el token.
    }
    else if(tokenCookie){
        token = tokenCookie
    }
    else if(!tokenBearer && !tokenCookie){
        return res.status(401).json({status:'error',message:"token not received"});
    }
    jwt.verify(token, config.privateKeyJWT, (err, decoded) => {
      if (err) {
        return res.status(401).json({status:'error',message:'invalid token'});
      } else {
        if(decoded.user.role == "user" && decoded.user.email != config.adminName){//decoded datos del token
            next()
        }
        else{
            return res.status(401).send({status:'error',message:'Unauthorized'})
        }
      }
    });
}

export const current = (req,res,next) =>{
  let token
    const tokenBearer = req.headers.authorization;
    const tokenCookie = req.cookies.tokenCookie;  // LO DEJO RECIBIR COOKIES POR SI NECESITO CONSULTAR EN NAVEGADOR
    if (tokenBearer) {
        token = tokenBearer.split(' ')[1];//LE SACO LA PRIMER PALABRA "Bearer", asi solo obtengo el token.
    }
    else if(tokenCookie){
        token = tokenCookie
    }
    else if(!tokenBearer && !tokenCookie){
        return res.status(401).json({status:'error',message:"token not received"});
    }
    jwt.verify(token, config.privateKeyJWT, (err, decoded) => {
      if (err) {
        return res.status(401).json({status:'error',message:'invalid token'});
      } else {
        if(decoded.user){//decoded datos del token
            next()
        }
        else{
            return res.status(401).send({status:'error',message:'Unauthorized'})
        }
      }
    });
}

export const isPremiumOrAdmin = (req,res,next) => {
  let token
  const tokenBearer = req.headers.authorization;
  const tokenCookie = req.cookies.tokenCookie;  // LO DEJO RECIBIR COOKIES POR SI NECESITO CONSULTAR EN NAVEGADOR
  if (tokenBearer) {
      token = tokenBearer.split(' ')[1];//LE SACO LA PRIMER PALABRA "Bearer", asi solo obtengo el token.
  }
  else if(tokenCookie){
      token = tokenCookie // Lo pongo asi ya que en las cookies no tienen "Bearer."
  }
  else if(!tokenBearer && !tokenCookie){
      return res.status(401).json({status:'error',message:"token not received"});
  }
  jwt.verify(token, config.privateKeyJWT, (err, decoded) => {
    if (err) {
      return res.status(401).json({status:'error',message:'invalid token'});
    } else {
      if(decoded.user.role == "admin" || decoded.user.role == "premium"){//decoded datos del token
          next()
      }
      else{
          return res.status(401).send({status:'error',message:'Unauthorized'})
      }
    }
  });
}
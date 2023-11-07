import EnumerationErrors from "../../services/errors/enum.js";

export default (error,req,res,next) =>{
    console.log(error.cause)
    switch (error.code){
        case EnumerationErrors.INVALID_TYPES_ERROR:
            res.send({status:"error",error:error.name,})
            break
        case EnumerationErrors.NOT_FOUND:
            res.send({status:"error",error:error.name})
            break
        case EnumerationErrors.DATABASE_ERROR:
            res.send({status:"error",error:error.name})
            break
        case EnumerationErrors.ROUTING_ERROR:
            res.send({status:"error",error:error.name})
            break
        default:
            res.send({status:"error",error:"Unhandled error"})
            break
    }
}
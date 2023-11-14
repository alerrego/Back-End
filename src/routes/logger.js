import { Router } from "express";

const router = Router()

router.get('/loggerTest', async(req,res) =>{
    req.logger.fatal("FATAL ERROR LOG")
    req.logger.error("ERROR LOG")
    req.logger.warning("WARNING LOG")
    req.logger.info("INFO LOG")
    req.logger.debug("DEBUG LOG")
    res.send({status:"success",message:"You tested the logger successfully"})
})

export default router
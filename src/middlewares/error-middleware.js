import { ApiError } from "../exceptions/ap-errors.js";

export const  errorMiddleware =  (err, req, res, next)=>{
    console.log(err)
    if(err instanceof ApiError){
        return res.status(err.status).json({error: err.message})
    }
    return res.status(500).json({error: 'internal server error'})
}
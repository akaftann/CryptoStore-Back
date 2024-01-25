import JwtService from "../services/jwt.js";
import { ApiError } from "../exceptions/ap-errors.js";

export const checkAccess = async (req, res, next) => {
    console.log('starting check access...')
    const authHeader = req.headers.authorization
    console.log('authHeader: ', authHeader)
    const token = authHeader?.split(" ")?.[1]
    console.log('token: ', token)
    if(!token){
        return res.status(401).json({error: 'Unathorized'})
    }

    const user = await JwtService.validateAccessToken(token)
    if(!user){
        return res.status(403).json({error: 'Access denied'})
    }

    req.user = user
    next()
}
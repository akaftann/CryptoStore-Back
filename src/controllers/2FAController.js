import jwtService from '../services/jwt.js'
import {generateOTP, verifyOTP, validateOTP, disableOTP} from '../services/2FA.js'

export const getQRImage = async (req, res, next) => {
    try{
        console.log('starting generate token...')
        const token = req.headers.authorization
        const {id} = await jwtService.validateAccessToken(token.split(' ')[1])
        const result = await generateOTP(id)
        return res.status(200).json({message: "success", result})
    }catch(e){
        next(e)
    }

}

export const verifyToken = async (req, res, next) => {
    try{
        const authToken = req.headers.authorization
        const {token} = req.body
        const {id} = await jwtService.validateAccessToken(authToken.split(' ')[1])
        const result = await verifyOTP(id, token)
        const {otpEnabled} = result
        return res.status(200).json({message: "success", otpEnabled});
    }catch(e){
        next(e)
    }
} 

export const validateTokent = async (req, res, next) => {
    try{
        const {token, userId} = req.body
        console.log('validateToken ...', userId, token)
        const otpValid = await validateOTP(userId, token)
        return res.status(200).json({message: "success", otpValid});
    }catch(e){
        next(e)
    }
}

export const disable = async (req, res, next) => {
    try{
        const authToken = req.headers.authorization
        const {id} = await jwtService.validateAccessToken(authToken.split(' ')[1])
        const isDisabled = await disableOTP(id)
        return res.status(200).json({message: "disabled", isDisabled});
    }catch(e){
        next(e)
    }
}
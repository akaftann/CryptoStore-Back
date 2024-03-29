import * as auth from '../services/auth.js'
import dotenv from 'dotenv'
import { refreshAccessToken } from '../services/sumSub.js'
dotenv.config()

export const login = async(req,res, next)=>{
    console.log('starting login...')
    const {email, pass} = req.body
    try{
        const result = await auth.login(email, pass)
        res.cookie('refreshToken', result.refreshToken,{maxAge:30*24*60*60*1000, httpOnly: true, secure: true})
        console.log('login res: ', {message:'success', accessToken: result.accessToken, isActivate: result.isActivate, email: result.maskEmail})
        console.log('login res2: ', result)
        res.status(200).json({message:'success', accessToken: result.accessToken, isActivated: result.isActivated, email: result.email, isVerified: result.isVerified, otpEnabled: result.otpEnabled, firstOtpPassed: result.firstOtpPassed})
    }catch(e){
        next(e)
    }

}

export const preLogin = async(req,res, next)=>{
    console.log('starting pre login...')
    const {email, pass} = req.body
    try{
        const result = await auth.login(email, pass)
        res.status(200).json({message:'success',  email: result.email, otpEnabled: result.otpEnabled, userId: result.userId})
    }catch(e){
        next(e)
    }

}

export const registration = async(req,res, next)=>{
    const {email, pass} = req.body
    console.log('starting registration...', req.body)
    try{
        const result = await auth.register(email,pass)
        console.log('masked mail: ', result.maskEmail)
        res.cookie('refreshToken', result.refreshToken,{maxAge:30*24*60*60*1000, httpOnly: true, secure: true})
        res.status(200).json({message:'user successfully created', accessToken: result.accessToken, email: result.email})
    }catch(e){
        next(e)
    }
}

export const logout = async(req, res, next)=>{
    try{
        const refreshToken = req.headers.cookie.split('; ').find(row => row.startsWith('refreshToken=')).split('=')[1];
        console.log('starting logout..', refreshToken)
        res.clearCookie('refreshToken')
        const token = await auth.logout(refreshToken)
        return res.status(200).json(token)
    }catch(e){
        next(e)
    }
}

export const refresh = async(req, res, next) => {
    try{
        console.log('start refreshing token...', req.cookie)
        const refreshToken = req.headers.cookie.split('; ').find(row => row.startsWith('refreshToken=')).split('=')[1];
        //const {refreshToken} = req.cookies
        const userData = await auth.refresh(refreshToken)
        res.cookie('refreshToken', userData.refreshToken,{maxAge:30*24*60*60*1000, httpOnly: true})
        return res.status(200).json(userData)
    }catch(e){
        next(e)
    }
}

export const activate = async(req, res, next)=>{
    try{
        const {activationCode} = req.body
        const token = req.headers.authorization
        const result = await auth.activate(activationCode, token)
        return res.status(200).json(result)
    }catch(e){
        next(e)
    }
}

export const refreshSumsubToken = async(req, res, next)=>{
    try{
        console.log('start generating token..')
        const externalId = req.body.externalId
        const result = await refreshAccessToken(externalId)
        return res.status(200).json(result)
    }catch(e){
        next(e)
    }
}
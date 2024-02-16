import * as auth from '../services/auth.js'
import dotenv from 'dotenv'
dotenv.config()

export const login = async(req,res, next)=>{
    console.log('starting login...')
    const {email, pass} = req.body
    try{
        const result = await auth.login(email, pass)
        res.cookie('refreshToken', result.refreshToken,{maxAge:30*24*60*60*1000, httpOnly: true, secure: true})
        console.log('login res: ', {message:'success', accessToken: result.accessToken, isActivate: result.isActivate, email: result.maskEmail})
        console.log('login res2: ', result)
        res.status(200).json({message:'success', accessToken: result.accessToken, isActivate: result.isActivate, email: result.email})
    }catch(e){
        next(e)
    }

}

export const registration = async(req,res, next)=>{
    console.log('starting registration...')
    const {email, pass} = req.body
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
        const {refreshToken} = req.cookies
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
        console.log('start refreshing token...', new Date().getSeconds())
        const {refreshToken} = req.cookies
        const userData = await auth.refresh(refreshToken)
        res.cookie('refreshToken', userData.refreshToken,{maxAge:30*24*60*60*1000, httpOnly: true})
        return res.status(200).json(userData)
    }catch(e){
        next(e)
    }
}

export const activate = async(req, res, next)=>{
    try{
        const link = req.params.link
        await auth.activate(link)
        return res.redirect(process.env.CLIENT_URL)
    }catch(e){
        next(e)
    }
}
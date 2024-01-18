import * as auth from '../services/auth.js'

export const login = async(req,res, next)=>{
    console.log('starting login...')
    const {email, pass} = req.body
    try{
        const token = await auth.login(email, pass)
        res.cookie('refreshToken', token.refreshToken,{maxAge:30*24*60*60*1000, httpOnly: true, secure: true})
        res.status(200).json({ email: email, token: token })
    }catch(e){
        next(e)
    }

}

export const registration = async(req,res, next)=>{
    console.log('starting registration...')
    const {email, pass} = req.body
    try{
        const data = await auth.register(email,pass)
        res.cookie('refreshToken', data.refreshToken,{maxAge:15*24*60*60*1000, httpOnly: true})
        res.status(200).json({message:'user successfully created', data})
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
        return res.json(userData)
    }catch(e){
        next(e)
    }
}
import { verify } from 'argon2'
import * as users from './users.js'
import jwtService from './jwt.js'
import { ApiError } from '../exceptions/ap-errors.js'
import { v4 as uuidv4 } from 'uuid'
import MailService from './mailService.js'
import * as db from '../lib/db.js'

const expiration = jwtService.access_token_expiration

export const login = async (email, pass)=>{
    try{
        const user = await users.getByEmail(email)
        if(!user){
            throw ApiError.NotFound()
        }
        const isValid = await verify(user.password, pass)
        if(!isValid){
            throw ApiError.UnauthorizedError('Invalid login or password')
        }
        const tokens = jwtService.generateToken(user.id)
        const isActivate = user.activationLink ? false : true
        await jwtService.saveToken(user.id, tokens.refreshToken)
        const maskEmail =  users.maskEmail(user.email)
        return {...tokens, isActivate, email: maskEmail}
    }catch(e){
        throw e
    }
}

export const register = async (email, pass)=>{
    try{
        const activationLink = uuidv4()
        await MailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)
        const user = await users.create(email, pass, activationLink)
        const tokens = jwtService.generateToken(user.id)
        await jwtService.saveToken(user.id, tokens.refreshToken)
        const maskEmail =  users.maskEmail(email)
        return {...tokens, email: maskEmail}
    }catch(e){
        throw e
    }
}

export const logout = async (refreshToken)=>{
    try{
        const token = await jwtService.removeToken(refreshToken)
        return token
    }catch(e){
        throw new Error(e.message)
    }
}

export const refresh = async (refreshToken)=>{
    try{
        console.log('refresh t..',refreshToken)
        if(!refreshToken){
            throw ApiError.UnauthorizedError('Unauthorized')
        }
        const userData = await jwtService.validateRefreshToken(refreshToken)
        const tokenInDb = await jwtService.findInDb(refreshToken)
        if(!userData || !tokenInDb){
            throw ApiError.UnauthorizedError('Unauthorized user')
        }
        const token = jwtService.generateToken(userData.id)
        await jwtService.saveToken(userData.id, token.refreshToken)
        const user = await users.getById(tokenInDb.userId)
        const isActivate = user.activationLink? false : true
        const maskEmail =  users.maskEmail(user.email)
        return {...token, isActivate, email: maskEmail}

    }catch(e){
        throw e
    }
}

export const activate = async (link)=> {
    try{
        console.log('starting activation, link: ', link)
        const result = await users.getByLink(link)
        if (!result.length) {
            throw ApiError.BadRequest('Invalid activaion link')
        }
        await users.activate(result)
    }catch(e){
        throw e
    }
}


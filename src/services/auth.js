import { verify } from 'argon2'
import * as users from './users.js'
import jwtService from './jwt.js'
import { ApiError } from '../exceptions/ap-errors.js'


export const login = async (email, pass)=>{
    try{
        const user = await users.getByEmail(email)
        if(!user){
            throw ApiError.BadRequest('User not found')
        }
        const isValid = await verify(user.password, pass)
        if(!isValid){
            throw ApiError.BadRequest('Invalid password')
        }
        const token = jwtService.generateToken(user.id)
        await jwtService.saveToken(user.id, token.refreshToken)
        return token
    }catch(e){
        throw new Error(e.message)
    }
}

export const register = async (email, pass)=>{
    try{
        const expiration = jwtService.access_token_expiration
        const user = await users.create(email, pass)
        const tokens = jwtService.generateToken(user.id)
        await jwtService.saveToken(user.id, tokens.refreshToken)
        return {...tokens, expiration}
    }catch(e){
        throw new Error(e.message)
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
        if(!refreshToken){
            throw ApiError.UnauthorizedError('Unauthorized user')
        }
        const userData = await jwtService.validateRefreshToken(refreshToken)
        const tokenInDb = await jwtService.findInDb(refreshToken)
        if(!userData || !tokenInDb){
            throw ApiError.UnauthorizedError('Unauthorized user')
        }
        const token = jwtService.generateToken(userData.id)
        await jwtService.saveToken(userData.id, token.refreshToken)
        return token

    }catch(e){

    }
}


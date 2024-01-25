import { verify } from 'argon2'
import * as users from './users.js'
import jwtService from './jwt.js'
import { ApiError } from '../exceptions/ap-errors.js'

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
        await jwtService.saveToken(user.id, tokens.refreshToken)
        return {...tokens, expiration}
    }catch(e){
        throw e
    }
}

export const register = async (email, pass)=>{
    try{
        const user = await users.create(email, pass)
        const tokens = jwtService.generateToken(user.id)
        await jwtService.saveToken(user.id, tokens.refreshToken)
        return {...tokens, expiration}
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
        console.log('refreshToken: ', refreshToken)
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
        return token

    }catch(e){
        throw e
    }
}


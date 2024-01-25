import jwt from 'jsonwebtoken'
import * as db from '../lib/db.js'
import dotenv from 'dotenv'
import { v4 as uuidV4 } from 'uuid'
dotenv.config()


class JwtService{
    constructor(){
        this.access_secret = process.env.JWT_ACCESS_SECRET
        this.refresh_secret = process.env.JWT_REFRESH_SECRET
        this.access_token_expiration = 18e5
    }
    generateToken(id){
        try{
            const payload = {
                id
            }
            const accessToken =  jwt.sign(payload, this.access_secret,{expiresIn:"1h"})
            const refreshToken =  jwt.sign(payload, this.refresh_secret,{expiresIn:"30d"})
            return {accessToken, refreshToken}
        }catch(e){
            throw new Error(e.message)
        }
    }

    async saveToken(userId, refreshToken){
        console.log('saving token....')
        try{
            const tokenData = await db.tokens.find({userId}, {}, {isIdempotent: true})
            const normalizedToken = db.normalize(tokenData.first())
            if(normalizedToken){
                const updToken =  await db.tokens.update({id: normalizedToken.id, refreshToken: refreshToken}, {}, {isIdempotent: true})
                return db.normalize(updToken.first())
            }
            const token  = await db.tokens.insert({id: uuidV4(),userId, refreshToken},{},{isIdempotent: true})
            console.log('finish saving token....')
            return db.normalize(token.first())
        }catch(e){
            throw new Error(e.message)
        }
    }

    parseToken(token){
        try{
            const data = jwt.verify(token, this.access_secret)
            return data
        }catch(e){
            return null
        }
        
    }

    async removeToken(refreshToken){
        try{
            const tokenData = await db.tokens.find({refreshToken}, {}, {isIdempotent: true})
            const normalizedToken = db.normalize(tokenData.first())
            await db.tokens.remove({id: normalizedToken.id}, {}, {isIdempotent: true})
            return normalizedToken
        }catch(e){
            throw new Error(e.message)
        }
    }

    async validateAccessToken(token){
        try{
            const data = jwt.verify(token, this.access_secret)
            return data
        }catch(e){
            return null
        }
    }
    
    async validateRefreshToken(token){
        try{
            const data = jwt.verify(token, this.refresh_secret)
            return data
        }catch(e){
            return null
        }
    }

    async findInDb(refreshToken){
        try{
            const tokenData = await db.tokens.find({refreshToken}, {}, {isIdempotent: true})
            const normalizedToken = db.normalize(tokenData.first())
            return normalizedToken
        }catch(e){
            throw new Error(e.message)
        }
    }
    
}

export default new JwtService()
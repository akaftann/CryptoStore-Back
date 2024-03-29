import * as db from '../lib/db.js'
import { hash, verify } from 'argon2'
import { v4 as uuidV4 } from 'uuid'
import { ApiError } from '../exceptions/ap-errors.js'

export const create = async (email, pass, activationCode, firstName= 'john', lastName='dou')=>{
    try{
        const isExists = await getByEmail(email)
        if (isExists){
            throw ApiError.Conflict() //errors.NotFound('Product does not exist')
          }
        const row = {
            id: uuidV4(),
            activationCode,
            email,
            firstName,
            is_activated:0,
            is_verified: 0,
            lastName,
            password: await hash(pass),
            otp_enabled: 0,
            otp_verified: 0,
            first_otp_passed: 0,
          }
          console.log('creating user with params: ', row)
        await db.users.insert(row,{ifNotExists: true},{isIdempotent: true})
        return row
    }catch(e){
        throw e
    }
}

export const getById = async (id)=>{
  try{
      const user = await db.users.find({id}, {}, {isIdempotent: true})
      if(user.length === 0){
          throw ApiError.BadRequest('User not found')
      }
      return db.normalize(user.first())
  }catch(e){
      throw e
  }
}

export const getByEmail = async (email)=>{
    try{
        const user = await db.users.find({email}, {}, {isIdempotent: true})
        
        return db.normalize(user.first())
    }catch(e){
        throw new Error(e.message)
    }
}

export const getByExternalId = async (externalId)=>{
    try{
        const user = await db.users.find({externalId}, {}, {isIdempotent: true})
        
        return db.normalize(user.first())
    }catch(e){
        throw new Error(e.message)
    }
}


export const activate = async (user) => {
    console.log('clearing activation code...')
    const updUser = await db.users.update({id: user.id, isActivated: 1, activationCode: null}, {}, {isIdempotent: true})
    return updUser
}

export const createSumsubExternalId = async (id, externalId) => {
    const user = await db.users.update({id, externalId}, {}, {isIdempotent: true})
    return user
}

export const refreshSumsubToken = async (id, token) => {
    const user = await db.users.update({id, sumsubToken: token}, {}, {isIdempotent: true})
    return user
}

export const maskEmail = (email)=>{
    const [local, domen] = email.split('@');
    const masked = local.substring(0, 2) + '*'.repeat(local.length - 2);
    const maskedEmail = `${masked}@${domen}`;
    return maskedEmail;
}

export const verifyStatus = async (externalId) => {
    console.log('search by link...')
    try{
        let user = await db.users.find({externalId}, {}, {isIdempotent: true})
        const normalizedUser = db.normalize(user.first())
         user = await db.users.update({id: normalizedUser.id, isVerified: 1}, {}, {isIdempotent: true})
        return user
    }catch(e){
        throw new Error(e.message)
    }
}
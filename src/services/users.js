import * as db from '../lib/db.js'
import { hash, verify } from 'argon2'
import { v4 as uuidV4 } from 'uuid'
import { ApiError } from '../exceptions/ap-errors.js'

export const create = async (email, pass, firstName= 'john', lastName='dou')=>{
    try{
        const isExists = await getByEmail(email)
        if (isExists){
            throw ApiError.Conflict() //errors.NotFound('Product does not exist')
          }
        const row = {
            id: uuidV4(),
            email,
            firstName,
            lastName,
            password: await hash(pass),
          }
        await db.users.insert(row,{ifNotExists: true},{isIdempotent: true})
        return row
    }catch(e){
        throw e
    }
}

export const getById = async (id)=>{
  try{
      const user = await db.users.find({id}, {}, {isIdempotent: true})
      if(!user){
          throw ApiError.BadRequest('User not found')
      }
      return db.normalize(user.first())
  }catch(e){
      throw new Error(e.message)
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
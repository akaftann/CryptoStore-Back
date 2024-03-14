import { ApiError } from '../exceptions/ap-errors.js'
import * as users from './users.js'
import jwtService from './jwt.js'
import * as db from '../lib/db.js'
import { v4 as uuidV4 } from 'uuid'

export const create =async (token, wallet, network) => {
    try{
        const {id} = await jwtService.validateAccessToken(token.split(' ')[1])
        const user = await users.getById(id)
        const oldWallet = await db.wallets.find({user_id:id}, {}, {isIdempotent: true})
        if(oldWallet.length > 0){
            throw ApiError.BadRequest('You already have a wallet, to add new one remove previous one first')
        }
        const row = {
            id: uuidV4(),
            walletNumber: wallet,
            network,
            userId: id
        }
        await db.wallets.insert(row,{ifNotExists: true},{isIdempotent: true})
        return row
    }catch(e){
        throw e
    }
}

export const remove = async (token) =>{
    try{
        const {id} = await jwtService.validateAccessToken(token.split(' ')[1])
        const wallet = await db.wallets.find({user_id:id}, {}, {isIdempotent: true})
        if(wallet.length === 0){
            throw ApiError.BadRequest('Wallet not found')
        }
        const normalized =  db.normalize(wallet.first())
        await db.wallets.remove({id:normalized.id})
    }catch(e){
        throw e
    }
}

export const getByUserId = async (userId) => {
    try{
        const result = await db.wallets.find({user_id:userId}, {}, {isIdempotent: true})
        if(result.length === 0){
            return null
        }
        const wallet =  db.normalize(result.first())
        return wallet
    }catch(e){
        throw e
    }
}
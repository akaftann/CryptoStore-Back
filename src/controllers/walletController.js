import {create, remove, getByUserId} from '../services/wallet.js'
import jwtService from '../services/jwt.js'

export const addWallet= async(req, res, next) => {
    try{
        console.log('adding wallet...')
        const token = req.headers.authorization
        const {walletNumber, network} = req.body
        const result = await create(token, walletNumber, network)
        return res.status(200).json({message:'success', walletNumber: result.walletNumber, network: result.network})
    }catch(e){
        next(e)
    }
}
export const removeWallet = async (req, res, next) =>{
    try{
        console.log('deleting wallet...')
        const token = req.headers.authorization
        await remove(token)
        return res.status(200).json({message:'success'})
    }catch(e){
        next(e)
    }
}

export const getByUser = async (req, res, next) => {
    try{
        const token = req.headers.authorization
        const {id} = await jwtService.validateAccessToken(token.split(' ')[1])
        const wallet = await getByUserId(id)
        if(!wallet){
            return res.status(200).json({message:'wallet not found'})
        }
        return res.status(200).json({wallet: wallet.walletNumber, network: wallet.network })
    }catch(e){
        next(e)
    }
}
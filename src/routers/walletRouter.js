import Router from 'express'
import * as walletController from '../controllers/walletController.js'


const walletRouter = new Router()
walletRouter.post('/wallet', walletController.addWallet)
walletRouter.get('/wallet/remove', walletController.removeWallet)
walletRouter.get('/wallet', walletController.getByUser)


export default walletRouter






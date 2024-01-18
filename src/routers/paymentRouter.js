import Router from 'express'
import * as paymentController from '../controllers/paymentController.js'

const paymentRouter = new Router()
paymentRouter.post('/checkout', paymentController.checkout)
export default paymentRouter






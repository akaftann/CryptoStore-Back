import Router from 'express'
import * as authController from '../controllers/authController.js'
import {check} from 'express-validator'
import * as iComplyController from '../controllers/SumsubController.js'
import * as OTPController from '../controllers/2FAController.js'


const authRouter = new Router()
authRouter.post('/login', check('email', 'username field can\'t be empty').notEmpty(),
    check('pass', 'password lenght should be between 4 and 10 symbols').isLength({min:4,max:10}), 
    authController.login)
    authRouter.post('/prelogin', check('email', 'username field can\'t be empty').notEmpty(),
    check('pass', 'password lenght should be between 4 and 10 symbols').isLength({min:4,max:10}), 
    authController.preLogin)
authRouter.post('/registration', check('email', 'username field can\'t be empty').notEmpty(),
    check('pass', 'password lenght should be between 4 and 10 symbols').isLength({min:4,max:10}), 
    authController.registration)
authRouter.post('/logout', authController.logout)
authRouter.get('/refresh', authController.refresh)
authRouter.post('/activate', authController.activate)
authRouter.post('/webhook-handler', iComplyController.webhook)
authRouter.post('/access-token', authController.refreshSumsubToken)
authRouter.get("/otp/generate", OTPController.getQRImage);
authRouter.post("/otp/verify", OTPController.verifyToken);
authRouter.post("/otp/validate", OTPController.validateTokent);
authRouter.get("/otp/disable", OTPController.disable);


export default authRouter






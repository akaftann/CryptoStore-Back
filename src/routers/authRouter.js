import Router from 'express'
import * as authController from '../controllers/authController.js'
import {check} from 'express-validator'
import * as iComplyController from '../controllers/iComplyController.js'


const authRouter = new Router()
authRouter.post('/login', check('email', 'username field can\'t be empty').notEmpty(),
    check('pass', 'password lenght should be between 4 and 10 symbols').isLength({min:4,max:10}), 
    authController.login)
authRouter.post('/registration', check('email', 'username field can\'t be empty').notEmpty(),
    check('pass', 'password lenght should be between 4 and 10 symbols').isLength({min:4,max:10}), 
    authController.registration)
authRouter.post('/logout', authController.logout)
authRouter.get('/activate/:link')
authRouter.get('/refresh', authController.refresh)
authRouter.get('/activate/:link', authController.activate)
authRouter.post('/webhook-handler', iComplyController.webhook)


export default authRouter






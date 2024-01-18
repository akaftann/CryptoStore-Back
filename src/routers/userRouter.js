import Router from 'express'
import * as userController from '../controllers/userController.js'
import {check} from 'express-validator'


const userRouter = new Router()
/* userRouter.post('/register', check('firstName', 'username field can\'t be empty').notEmpty(),
    check('pass', 'password lenght should be between 4 and 10 symbols').isLength({min:4,max:10}), 
    userController.createUser) */
/* router.post('/login', check('email', 'username field can\'t be empty').notEmpty(),
    check('pass', 'password lenght should be between 4 and 10 symbols').isLength({min:4,max:10}), 
    AuthController.login)
router.route('/comments')
    .post(CommentController.create)  
    .get(CommentController.getMains)
router.route('/comments/:id')
    .post(CommentController.createReply)
    .get(CommentController.getById) */

    export default userRouter






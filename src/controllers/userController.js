import * as userService from '../services/users.js'


export const createUser = async(req,res, next)=>{
    console.log('strating register')
    const {firstName, lastName, pass, email} = req.body
    try{
        const user = await userService.create(firstName, lastName, pass, email)
        res.status(200).json('User successfully created!')
    }catch(e){
        next(e)
    }
}

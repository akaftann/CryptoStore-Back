import express from 'express'
import * as routers from './src/routers/index.js'
import cors from 'cors'
import { errorMiddleware } from './src/middlewares/error-middleware.js'
import { checkAccess } from './src/middlewares/checkAuthorization.js'
import {rawBodyMiddleware} from './src/middlewares/reqFormatting.js'
import dotenv from 'dotenv'
dotenv.config()



const app = express()

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))
app.use(rawBodyMiddleware)
app.use(express.urlencoded({ extended: true }))
app.use('/api', routers.userRouter)
app.use('/api', routers.paymentRouter)
app.use('/api', routers.authRouter)
app.use(errorMiddleware)

app.get('/api/protected', checkAccess, (req, res) => {
    const {user} = req
    res.json('hello world' + Date.now() + ' user: ' + user.id)
})

app.get('/api', (req, res)=>{
    console.log('its get req...')
    res.json('hello get')
})

app.listen(3000, () => {
    console.log('server started at port 3000', process.env.CLIENT_URL)
})

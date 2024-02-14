import express from 'express'
import * as db from './src/lib/db.js'
import * as routers from './src/routers/index.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { errorMiddleware } from './src/middlewares/error-middleware.js'
import { checkAccess } from './src/middlewares/checkAuthorization.js'
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))
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
    console.log('server started at port 3000')
})

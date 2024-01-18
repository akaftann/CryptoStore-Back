import express from 'express'
import * as db from './src/lib/db.js'
import * as routers from './src/routers/index.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { errorMiddleware } from './src/middlewares/error-middleware.js'
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

app.get('/', async (req, res) => {
    res.json('hello world')
})
app.listen(3000, () => {
    console.log('server started at port 3000')
})

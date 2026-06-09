import express from 'express'
import cors from 'cors'
import path from 'path'

import 'dotenv/config'
import connectDb from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouterr from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'


//App config
const app = express()
const port = process.env.PORT || 4000
connectDb()
connectCloudinary()
//MIDDLEWARES
app.use(express.json())
app.use(cors())
app.use((req, res, next) => {
  console.log('backend request', { method: req.method, path: req.path, headers: {
    token: req.headers.token,
    authorization: req.headers.authorization
  } })
  next()
})
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))


//api endpoint
app.use('/api/user', userRouter)
app.use('/api/product', productRouterr)
app.use('/api/cart',cartRouter)
app.use('/api/orders',orderRouter)
app.get('/', (req, res) => {
  res.send('API working')
})

app.listen(port, () => {
  console.log('server started')
})
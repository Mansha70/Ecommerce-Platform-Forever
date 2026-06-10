import express from 'express'
import cors from 'cors'
import path from 'path'
import serverless from 'serverless-http'
import 'dotenv/config'

import connectDb from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'

const app = express()

// Connect services without blocking Vercel function startup
connectDb()
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error))

connectCloudinary()
  .then(() => console.log('Cloudinary configured'))
  .catch((error) => console.error('Cloudinary configuration error:', error))

// Middleware
app.use(express.json())
app.use(cors())
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

// Routes
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/orders', orderRouter)

app.get('/', (req, res) => {
  res.send('API Working')
})

if (!process.env.VERCEL) {
  const port = process.env.PORT || 4000
  app.listen(port, () => {
    console.log(`server started on port ${port}`)
  })
}

export default serverless(app)
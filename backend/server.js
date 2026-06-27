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

// Avoid cold-start crashes in serverless: connect lazily and never throw at import-time.
let dbConnected = false
let dbConnecting = null

const ensureDbConnected = async () => {
  if (dbConnected) return
  if (dbConnecting) return dbConnecting

  dbConnecting = connectDb()
    .then(() => {
      dbConnected = true
      console.log('MongoDB connected')
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error)
      throw error
    })
    .finally(() => {
      dbConnecting = null
    })

  return dbConnecting
}

let cloudinaryConfigured = false
let cloudinaryConfigPromise = null

const ensureCloudinaryConfigured = async () => {
  if (cloudinaryConfigured) return
  if (cloudinaryConfigPromise) return cloudinaryConfigPromise

  cloudinaryConfigPromise = connectCloudinary()
    .then(() => {
      cloudinaryConfigured = true
      console.log('Cloudinary configured')
    })
    .catch((error) => {
      console.error('Cloudinary configuration error:', error)
      // Don't throw on startup; endpoints using Cloudinary will fail with a clear error.
    })
    .finally(() => {
      cloudinaryConfigPromise = null
    })

  return cloudinaryConfigPromise
}


// Middleware
app.use(express.json())
app.use(cors())
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

// Ensure DB is connected before any API routes (serverless-safe)
app.use(async (req, res, next) => {
  try {
    // Only block for DB on API calls; '/' doesn't need DB.
    if (req.path.startsWith('/api/')) {
      await ensureDbConnected()
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: err.message,
    })
  }
  next()
})

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
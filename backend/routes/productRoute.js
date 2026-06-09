import express from 'express'
import { addProduct,singleProduct,listProducts,removeProduct } from '../controllers/productController.js'
import upload from '../middleware/multer.js'
import adminAuth from '../middleware/adminAuth.js'


const productRouterr=express.Router()


productRouterr.post('/add',adminAuth,upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]),addProduct)
productRouterr.post('/remove',adminAuth,removeProduct)
productRouterr.post('/single',singleProduct)
productRouterr.get('/list',listProducts)

export default productRouterr
import {v2 as cloudinary} from 'cloudinary'
import productModel from '../models/productModel.js'

// function for add product

const addProduct = async (req, res) => {
  try {
    console.log('Add product request received')
    console.log('Body:', req.body)
    console.log('Files:', req.files)

    const { name, description, category, subCategory, sizes, bestSeller, price } = req.body
    const image1 = req.files.image1 && req.files.image1[0]
    const image2 = req.files.image2 && req.files.image2[0]
    const image3 = req.files.image3 && req.files.image3[0]
    const image4 = req.files.image4 && req.files.image4[0]
    const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

    console.log('Images count:', images.length)

    const baseUrl = `${req.protocol}://${req.get('host')}`
    let imagesUrl = []

    if (
      process.env.CLOUDINARY_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ) {
      try {
        imagesUrl = await Promise.all(
          images.map(async (item) => {
            const result = await cloudinary.uploader.upload(item.path, {
              resource_type: 'image',
            })
            return result.secure_url
          })
        )
      } catch (cloudError) {
        console.log('Cloudinary upload failed, falling back to local storage:', cloudError.message)
        imagesUrl = images.map((item) => `${baseUrl}/uploads/${item.filename}`)
      }
    } else {
      imagesUrl = images.map((item) => `${baseUrl}/uploads/${item.filename}`)
    }

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestSeller: bestSeller === 'true' ? true : false,
      sizes: JSON.parse(sizes),
      image: imagesUrl,
      date: Date.now(),
    }
    console.log('Product data prepared:', productData)

    const product = new productModel(productData)
    await product.save()
    console.log('Product saved successfully')

    res.json({ success: true, message: 'Product Added' })
  } catch (error) {
    console.log('Error in addProduct:', error.message)
    console.log('Full error:', error)
    res.json({ success: false, message: error.message })
  }
}


// function for list product

const listProducts=async(req,res)=>{
try{
    const products=await productModel.find({})
    res.json({success:true,products})
}catch(error){
    res.json({
        success:true,
        message:error.message
    })
}
}

// function for removing product

const removeProduct=async(req,res)=>{
  try{
    await productModel.findByIdAndDelete(req.body.id)
    res.json({success:true,message:"Product Removed"})
  }catch(error){
    res.json({
        success:false,
        message:error.message
    })
  }
}

// function for single product info

const singleProduct=async(req,res)=>{
try{
    const {productId}=req.body
    const product=await productModel.findById(productId)
     res.json({
        success:true,
        product
     })
}catch(error){
    res.json({
        success:false,
        message:error.message
    })
}
}


export {listProducts,addProduct,removeProduct,singleProduct}

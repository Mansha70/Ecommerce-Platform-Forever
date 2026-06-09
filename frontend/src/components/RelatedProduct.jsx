import React, { useContext, useEffect, useState } from 'react'
import Title from './Title'
import ProductItem from './ProductItem'
import { ShopContext } from '../context/ShopContext'

const RelatedProduct = ({
  category,
  subCategory,
  currentProductId
}) => {

  const { products } = useContext(ShopContext)

  const [related, setRelated] = useState([])

  useEffect(() => {

    if (products.length > 0) {

      let productCopy = products.slice()

      // Same Category
      productCopy = productCopy.filter(
        (item) => category === item.category
      )

      // Same SubCategory
      productCopy = productCopy.filter(
        (item) => subCategory === item.subCategory
      )

      // Remove Current Product
      productCopy = productCopy.filter(
        (item) => item._id !== currentProductId
      )

      setRelated(productCopy.slice(0, 5))
    }

  }, [products, category, subCategory, currentProductId])

  return (

    <div className='my-24'>

      {/* Title */}
      <div className='text-center text-3xl py-2'>
        <Title
          text1={'RELATED'}
          text2={'PRODUCTS'}
        />
      </div>

      {/* Products */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>

        {
          related.map((item) => (

            <ProductItem
              key={item._id}
              id={item._id}
              name={item.name}
              price={item.price}
              image={item.image}
            />

          ))
        }

      </div>

    </div>

  )
}

export default RelatedProduct
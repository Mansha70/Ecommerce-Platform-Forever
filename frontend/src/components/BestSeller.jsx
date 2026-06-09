import React, { useContext, useMemo } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

const BestSeller = () => {
  const { products } = useContext(ShopContext)

  const bestSeller = useMemo(() => {
    if (!products || products.length === 0) return []

    return products
      .filter((item) =>
        item.bestSeller === true ||
        item.bestSeller === 'true' ||
        item.bestseller === true ||
        item.bestseller === 'true'
      )
      .slice(0, 5)
  }, [products])

  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title text1="BEST" text2="SELLERS" />

        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Discover our most popular products loved by customers.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {bestSeller.length > 0 ? (
          bestSeller.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-10">
            No best seller products found yet.
          </div>
        )}
      </div>
    </div>
  )
}

export default BestSeller
import React, { useContext, useEffect, useState, useCallback } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'

const Collections = () => {

  const { products, search, showSearch } = useContext(ShopContext)

  const [showFilter, setShowFilter] = useState(false)
  const [filterProducts, setFilterProducts] = useState([])

  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])

  const [sortType, setSortType] = useState('relevant')

  // Toggle Category

  const toggleCategory = (e) => {

    if (category.includes(e.target.value)) {

      setCategory(prev =>
        prev.filter(item => item !== e.target.value)
      )

    } else {

      setCategory(prev => [...prev, e.target.value])

    }

  }

  // Toggle SubCategory

  const toggleSubCategory = (e) => {

    if (subCategory.includes(e.target.value)) {

      setSubCategory(prev =>
        prev.filter(item => item !== e.target.value)
      )

    } else {

      setSubCategory(prev => [...prev, e.target.value])

    }

  }

  // Apply Filters + Sorting

  const applyFilter = useCallback(() => {

    let productsCopy = products.slice()

    // Search Filter

    if (showSearch && search) {

      productsCopy = productsCopy.filter(item =>
        item.name?.toLowerCase().includes(
          search.toLowerCase().trim()
        )
      )

    }

    // Category Filter

    if (category.length > 0) {

      productsCopy = productsCopy.filter(item =>
        category.includes(item.category)
      )

    }

    // SubCategory Filter

    if (subCategory.length > 0) {

      productsCopy = productsCopy.filter(item =>
        subCategory.includes(item.subCategory)
      )

    }

    // Sorting

    switch (sortType) {

      case 'low-high':

        productsCopy.sort((a, b) => a.price - b.price)
        break

      case 'high-low':

        productsCopy.sort((a, b) => b.price - a.price)
        break

      default:
        break

    }

    setFilterProducts(productsCopy)

  }, [products, category, subCategory, sortType, search, showSearch])

  // Run Filter

  useEffect(() => {
    applyFilter()
  }, [applyFilter])

  return (

    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>

      {/* Left Side Filters */}

      <div className='min-w-60'>

        <p
          onClick={() => setShowFilter(!showFilter)}
          className='my-2 text-xl flex items-center cursor-pointer gap-2'
        >

          FILTERS

          <img
            className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`}
            src={assets.dropdown_icon}
            alt=""
          />

        </p>

        {/* Category Filter */}

        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>

          <p className='mb-3 text-sm font-medium'>
            CATEGORIES
          </p>

          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>

            <p className='flex gap-2'>

              <input
                className='w-3'
                type="checkbox"
                value='Men'
                onChange={toggleCategory}
              />

              Men

            </p>

            <p className='flex gap-2'>

              <input
                className='w-3'
                type="checkbox"
                value='Women'
                onChange={toggleCategory}
              />

              Women

            </p>

            <p className='flex gap-2'>

              <input
                className='w-3'
                type="checkbox"
                value='Kids'
                onChange={toggleCategory}
              />

              Kids

            </p>

          </div>

        </div>

        {/* SubCategory Filter */}

        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>

          <p className='mb-3 text-sm font-medium'>
            TYPE
          </p>

          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>

            <p className='flex gap-2'>

              <input
                className='w-3'
                type="checkbox"
                value='Topwear'
                onChange={toggleSubCategory}
              />

              Topwear

            </p>

            <p className='flex gap-2'>

              <input
                className='w-3'
                type="checkbox"
                value='Bottomwear'
                onChange={toggleSubCategory}
              />

              Bottomwear

            </p>

            <p className='flex gap-2'>

              <input
                className='w-3'
                type="checkbox"
                value='Winterwear'
                onChange={toggleSubCategory}
              />

              Winterwear

            </p>

          </div>

        </div>

      </div>

      {/* Right Side */}

      <div className='flex-1'>

        <div className='flex justify-between text-base sm:text-2xl mb-4'>

          <Title text1='ALL' text2='COLLECTIONS' />

          {/* Sort Dropdown */}

          <select
            onChange={(e) => setSortType(e.target.value)}
            className='border-2 border-gray-300 text-sm px-2'
          >

            <option value='relevant'>
              Sort by: Relevant
            </option>

            <option value='low-high'>
              Sort by: Low to High
            </option>

            <option value='high-low'>
              Sort by: High to Low
            </option>

          </select>

        </div>

        {/* Products Grid */}

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>

          {
            filterProducts.map((item, index) => (

              <ProductItem
                key={index}
                id={item._id}
                name={item.name}
                price={item.price}
                image={item.image}
              />

            ))
          }

        </div>

      </div>

    </div>

  )
}

export default Collections
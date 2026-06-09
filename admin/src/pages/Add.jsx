
import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { backendUrl } from '../App'
import axios from 'axios'
import { toast } from 'react-toastify'

const Add = ({token}) => {

  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("Men")
  const [subCategory, setSubCategory] = useState("Topwear")
  const [bestSeller, setBestSeller] = useState(false)
  const [sizes, setSizes] = useState([])

  const sizeHandler = (size) => {
    setSizes((prev) =>
      prev.includes(size)
        ? prev.filter((item) => item !== size)
        : [...prev, size]
    )
  }

 const onSubmitHandler = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("subCategory", subCategory);
    formData.append("bestSeller", bestSeller);
    formData.append("sizes", JSON.stringify(sizes));

    image1 && formData.append("image1", image1);
    image2 && formData.append("image2", image2);
    image3 && formData.append("image3", image3);
    image4 && formData.append("image4", image4);

    const response = await axios.post(
      backendUrl + "/api/product/add",
      formData,
      {headers: {"token": token}}
    );

      if(response.data.success){
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setPrice('')
      }else{
        toast.error(response.data.message)
      }

  } catch (err) {
    console.log("Error:", err.response?.data || err.message);
    toast.error(err.message)
  }
};

  return (
    <form
      onSubmit={onSubmitHandler}
      className='flex flex-col w-full items-start gap-3'
    >
      <div>
        <p className='mb-2'>Upload Images</p>

        <div className="flex gap-2">
          <label htmlFor="image1">
            <img
              src={image1 ? URL.createObjectURL(image1) : assets.upload_area}
              alt=""
              className="w-20 cursor-pointer"
            />
            <input
              type="file"
              id="image1"
              hidden
              onChange={(e) => setImage1(e.target.files[0])}
            />
          </label>

          <label htmlFor="image2">
            <img
              src={image2 ? URL.createObjectURL(image2) : assets.upload_area}
              alt=""
              className="w-20 cursor-pointer"
            />
            <input
              type="file"
              id="image2"
              hidden
              onChange={(e) => setImage2(e.target.files[0])}
            />
          </label>

          <label htmlFor="image3">
            <img
              src={image3 ? URL.createObjectURL(image3) : assets.upload_area}
              alt=""
              className="w-20 cursor-pointer"
            />
            <input
              type="file"
              id="image3"
              hidden
              onChange={(e) => setImage3(e.target.files[0])}
            />
          </label>

          <label htmlFor="image4">
            <img
              src={image4 ? URL.createObjectURL(image4) : assets.upload_area}
              alt=""
              className="w-20 cursor-pointer"
            />
            <input
              type="file"
              id="image4"
              hidden
              onChange={(e) => setImage4(e.target.files[0])}
            />
          </label>
        </div>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product Name</p>
        <input
          className='w-full max-w-125 px-3 py-2 border'
          type="text"
          placeholder='Type here'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product Description</p>
        <textarea
          className='w-full max-w-125 px-3 py-2 border'
          placeholder='Write content here'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className='flex flex-col sm:flex-row gap-4 w-full'>
        <div>
          <p className='mb-2'>Product Category</p>
          <select
            className='px-3 py-2 border'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Sub Category</p>
          <select
            className='px-3 py-2 border'
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
          >
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Product Price</p>
          <input
            className='px-3 py-2 border'
            type="number"
            placeholder='25'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      </div>

      <div>
        <p className='mb-2'>Product Sizes</p>

        <div className='flex gap-3'>
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <p
              key={size}
              onClick={() => sizeHandler(size)}
              className={`px-3 py-1 cursor-pointer ${
                sizes.includes(size)
                  ? "bg-pink-200"
                  : "bg-slate-200"
              }`}
            >
              {size}
            </p>
          ))}
        </div>
      </div>

      <div className='flex gap-2 mt-2'>
        <input
          type="checkbox"
          id="bestseller"
          checked={bestSeller}
          onChange={() => setBestSeller((prev) => !prev)}
        />
        <label
          className='cursor-pointer'
          htmlFor="bestseller"
        >
          Add to Best Seller
        </label>
      </div>

      <button
        type="submit"
        className='w-28 py-3 mt-4 bg-black text-white'
      >
        Add
      </button>
    </form>
  )
}

export default Add


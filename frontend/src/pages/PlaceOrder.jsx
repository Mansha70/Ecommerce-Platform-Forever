import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

  const [method, setMethod] = useState('cod')

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  })

  const { navigate,backendUrl,token,cartItems,setCartItems,getCartAmount,delivery_fee,products} = useContext(ShopContext)

  const onChangeHandler = (event) => {
    const { name, value } = event.target

    setFormData((data) => ({
      ...data,
      [name]: value
    }))
  }

  const verifyRazorpay = async (response, appOrderId) => {
    try {
      const verifyResponse = await axios.post(
        backendUrl + '/api/orders/verifyRazorpay',
        {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          appOrderId,
        },
        {
          headers: {
            token,
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (verifyResponse.data.success) {
        setCartItems({})
        navigate('/orders')
      } else {
        toast.error(verifyResponse.data.message)
      }
    } catch (err) {
      console.log(err)
      toast.error(err.message)
    }
  }

  const initPay=(order, appOrderId)=>{
    const options={
      key:import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount:order.amount,
      currency:order.currency,
      name:'Order Payment',
      description:'Order Payment',
      order_id:order.id,
      receipt:order.receipt,
      handler:async(response)=>{
        await verifyRazorpay(response, appOrderId)
      }
    }
    const rzp=new window.Razorpay(options)
    rzp.open()
  }

  const onSubmitHandler=async(event)=>{
    event.preventDefault()
    try{
      let orderItems=[]
      for(const items in cartItems){
        for(const item in cartItems[items]){
          if(cartItems[items][item]>0){
            const itemInfo=structuredClone(products.find(product=>product._id===items))
            if(itemInfo){
              itemInfo.size=item
              itemInfo.quantity=cartItems[items][item]
              orderItems.push(itemInfo)
            }
          }
        }
      }
      let orderData={
        address:formData,
        items:orderItems,
        amount: getCartAmount() + delivery_fee
      }
      switch(method){
        //api calls or cod
        case 'cod': {
          console.log('PlaceOrder submit', { token, orderData })
          if (!token) {
            toast.error('You must be logged in to place an order.')
            return
          }
          const response = await axios.post(
            backendUrl + '/api/orders/place',
            orderData,
            {
              headers: {
                token,
                Authorization: `Bearer ${token}`,
              },
            }
          )
          if(response.data.success){
            setCartItems({})
            navigate('/orders')
          }else{
            toast.error(response.data.message)
          }
          break;
        }
        case 'stripe': {
          const responseStripe=await axios.post(backendUrl+'/api/orders/stripe',orderData,{headers:{token,Authorization:`Bearer ${token}`}})
          if(responseStripe.data.success){
            const {session_url}=responseStripe.data 
            window.location.replace(session_url)
          }else{
            toast.error(responseStripe.data.message)
          }
          break;
        }
        case 'razorpay': {
          const responseRazorpay=await axios.post(backendUrl+'/api/orders/razorpay',orderData,{headers:{token,Authorization:`Bearer ${token}`}})
          if(responseRazorpay.data.success){
            initPay(responseRazorpay.data.order, responseRazorpay.data.appOrderId)
          } else {
            toast.error(responseRazorpay.data.message)
          }
          break;
        }
        default:
          break
      }

    }catch(err){
      console.log(err)
      toast.error(err.message)
    }
  }

  return (
    <form
      onSubmit={onSubmitHandler}
      className='flex flex-col lg:flex-row justify-between gap-10 pt-5 sm:pt-14 min-h-[80vh] border-t'
    >

      {/* Left Side */}
      <div className='flex flex-col gap-4 w-full lg:max-w-[480px]'>

        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>

        <div className='flex gap-3'>
          <input
            name='firstName'
            value={formData.firstName}
            onChange={onChangeHandler}
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type='text'
            placeholder='First name'
            required
          />

          <input
            name='lastName'
            value={formData.lastName}
            onChange={onChangeHandler}
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type='text'
            placeholder='Last name'
            required
          />
        </div>

        <input
          name='email'
          value={formData.email}
          onChange={onChangeHandler}
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
          type='email'
          placeholder='Email address'
          required
        />

        <input
          name='street'
          value={formData.street}
          onChange={onChangeHandler}
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
          type='text'
          placeholder='Street'
          required
        />

        <div className='flex gap-3'>
          <input
            name='city'
            value={formData.city}
            onChange={onChangeHandler}
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type='text'
            placeholder='City'
            required
          />

          <input
            name='state'
            value={formData.state}
            onChange={onChangeHandler}
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type='text'
            placeholder='State'
            required
          />
        </div>

        <div className='flex gap-3'>
          <input
            name='zipcode'
            value={formData.zipcode}
            onChange={onChangeHandler}
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type='number'
            placeholder='Zip Code'
            required
          />

          <input
            name='country'
            value={formData.country}
            onChange={onChangeHandler}
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type='text'
            placeholder='Country'
            required
          />
        </div>

        <input
          name='phone'
          value={formData.phone}
          onChange={onChangeHandler}
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
          type='tel'
          placeholder='Phone'
          required
        />

      </div>

      {/* Right Side */}
      <div className='w-full lg:max-w-[450px]'>

        <CartTotal />

        <div className='mt-12'>

          <Title text1={'PAYMENT'} text2={'METHOD'} />

          <div className='flex flex-col lg:flex-row gap-3'>

            {/* Stripe */}
            <div
              onClick={() => setMethod('stripe')}
              className='flex items-center gap-3 border p-2 px-3 cursor-pointer'
            >
              <p
                className={`min-w-3 h-3.5 border rounded-full ${
                  method === 'stripe' ? 'bg-green-400' : ''
                }`}
              ></p>

              <img
                className='h-5 mx-4'
                src={assets.stripe_logo}
                alt='Stripe'
              />
            </div>

            {/* Razorpay */}
            <div
              onClick={() => setMethod('razorpay')}
              className='flex items-center gap-3 border p-2 px-3 cursor-pointer'
            >
              <p
                className={`min-w-3 h-3.5 border rounded-full ${
                  method === 'razorpay' ? 'bg-green-400' : ''
                }`}
              ></p>

              <img
                className='h-5 mx-4'
                src={assets.razorpay_logo}
                alt='Razorpay'
              />
            </div>

            {/* COD */}
            <div
              onClick={() => setMethod('cod')}
              className='flex items-center gap-3 border p-2 px-3 cursor-pointer'
            >
              <p
                className={`min-w-3 h-3.5 border rounded-full ${
                  method === 'cod' ? 'bg-green-400' : ''
                }`}
              ></p>

              <p className='text-gray-500 text-sm font-medium mx-4'>
                CASH ON DELIVERY
              </p>
            </div>

          </div>

          <div className='w-full text-end mt-8'>
            <button
              type='submit'
              className='bg-black text-white px-16 py-3 text-sm hover:bg-gray-800 transition-all'
            >
              PLACE ORDER
            </button>
          </div>

        </div>

      </div>

    </form>
  )
}

export default PlaceOrder
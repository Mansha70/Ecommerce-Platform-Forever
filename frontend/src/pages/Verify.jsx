import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const Verify = () => {
  const { navigate, token, setCartItems, backendUrl } =
    useContext(ShopContext)

  const [searchParams] = useSearchParams()

  const success = searchParams.get('success')
  const orderId = searchParams.get('orderId')

  const verifyPayment = async () => {
    try {
      if (!token) return

      const response = await axios.post(
        `${backendUrl}/api/orders/verifyStripe`,
        { success, orderId },
        {
          headers: {
            token,
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.success) {
        setCartItems({})
        navigate('/orders')
      } else {
        navigate('/cart')
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
      navigate('/cart')
    }
  }

  useEffect(() => {
    verifyPayment()
  }, [token])

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-lg font-medium">
        Verifying Payment...
      </div>
    </div>
  )
}

export default Verify
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])

  const fetchAllOrders = async () => {
    if (!token) return

    try {
      const response = await axios.post(
        `${backendUrl}/api/orders/list`,
        {},
        {
          headers: { token }
        }
      )

      if (response.data.success) {
        setOrders(response.data.orders)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/orders/status`,
        {
          orderId,
          status: event.target.value
        },
        {
          headers: { token }
        }
      )

      if (response.data.success) {
        toast.success('Order Status Updated')
        fetchAllOrders()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }
 

  useEffect(() => {
    fetchAllOrders()
  }, [token])

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Orders Page</h3>

      <div className="flex flex-col gap-4">
        {orders.map((order, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-[0.5fr_2fr_1fr] gap-4 border p-5 rounded-md"
          >
            <img
              className="w-12"
              src={assets.parcel_icon}
              alt="parcel"
            />

            <div>
              <div>
                {order.items.map((item, itemIndex) => (
                  <p key={itemIndex}>
                    {item.name} x {item.quantity}
                    {item.size && (
                      <span className="ml-1">({item.size})</span>
                    )}
                  </p>
                ))}
              </div>

              <div className="mt-3">
                <p className="font-medium">
                  {order.address.firstName} {order.address.lastName}
                </p>

                <p>{order.address.street}</p>

                <p>
                  {order.address.city}, {order.address.state},{' '}
                  {order.address.country}
                </p>

                <p>{order.address.zipcode}</p>

                <p>{order.address.phone}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p>
                <span className="font-medium">Items :</span>{' '}
                {order.items.length}
              </p>

              <p>
                <span className="font-medium">Method :</span>{' '}
                {order.paymentMethod}
              </p>

              <p>
                <span className="font-medium">Payment :</span>{' '}
                {order.payment ? 'Done' : 'Pending'}
              </p>

              <p>
                <span className="font-medium">Amount :</span> ₹
                {order.amount}
              </p>

              <select
                onChange={(event) =>
                  statusHandler(event, order._id)
                }
                value={order.status}
                className="border rounded px-3 py-2"
              >
                <option value="Order Placed">
                  Order Placed
                </option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">
                  Out for delivery
                </option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
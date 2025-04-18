import React, { useEffect, useState } from 'react';
import './Orders.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets, url, currency } from '../../assets/assets';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  // Fetch all orders from API
  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`, {
        headers: { token: localStorage.getItem('adminToken') },
      });

      if (response.data.success) {
        setOrders([...response.data.data].reverse()); 
      } else {
        toast.error('Error fetching orders');
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
    }
  };

  // Update order status
  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        `${url}/order/status`,
        {
          orderId,
          status: event.target.value,
        },
        { headers: { token: localStorage.getItem('adminToken') } }
      );

      if (response.data.success) {
        await fetchAllOrders();
        toast.success('Order status updated');
      } else {
        toast.error('Error updating status');
      }
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="order add">
      <h3>Gym Orders Page</h3>
      <div className="order-list">
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <div key={order.id || index} className="order-item">
              <img src={assets.parcel_icon} alt="Order Parcel Icon" />
              <div>
                <p className="order-item-products">
                  {order.items.map((item, idx) =>
                    idx === order.items.length - 1
                      ? `${item.name} x ${item.quantity}`
                      : `${item.name} x ${item.quantity}, `
                  )}
                </p>
                <p className="order-item-name">
                  {order.address.firstName} {order.address.lastName}
                </p>
                <div className="order-item-address">
                  <p>{order.address.street},</p>
                  <p>
                    {order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}
                  </p>
                </div>
                <p className="order-item-phone">{order.address.phone}</p>
              </div>
              <p>Items: {order.items.length}</p>
              <p>
                {currency}
                {order.amount}
              </p>
              <select onChange={(e) => statusHandler(e, order.id)} value={order.status}>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))
        ) : (
          <p>No orders found</p>
        )}
      </div>
    </div>
  );
};

export default Orders;

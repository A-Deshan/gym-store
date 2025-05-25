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
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        setOrders([...response.data.data].reverse());
      } else {
        toast.error('Error fetching orders');
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
      console.error('Fetch error:', error);
    }
  };

  // Update order status 
  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/order/update`,
        {
          orderId,
          status: event.target.value,
        }
      );

      if (response.data.success) {
        await fetchAllOrders();
        toast.success('Order status updated');
      } else {
        toast.error('Error updating status');
      }
    } catch (error) {
      console.error("Failed to update order status:", error.response || error.message || error);
      toast.error('Failed to update order status');
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    fetchAllOrders();
  }, []);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Handle pagination
  const handlePageChange = (direction) => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next' && currentPage * itemsPerPage < orders.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="order add">
      <h3>Gym Orders Page</h3>
      <div className="order-list">
        {orders.length > 0 ? (
          currentOrders.map((order, index) => {
            const itemsArray = order.items || [];

            return (
              <div key={order.id || index} className="order-item">
                <div className="order-user-info">
                  <p className="order-item-id">Order ID: {order.id}</p>
                  <p className="order-item-name">User ID: {order.userId}</p>
                  <p>
                    {order.date
                      ? new Date(order.date).toLocaleString()
                      : new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="order-details">
                  <h4>Order Items:</h4>
                  {itemsArray.length > 0 ? (
                    <ul className="order-item-products">
                      {itemsArray.slice(0, 10).map((item, idx) => (
                        <li key={idx}>
                          {item?.name || 'Unknown'} x {item?.quantity || 0}
                        </li>
                      ))}
                      {itemsArray.length > 10 && (
                        <li>...and {itemsArray.length - 10} more items</li>
                      )}
                    </ul>
                  ) : (
                    <p>No items in this order</p>
                  )}
                </div>

                <div className="order-amount">
                  <p className="order-total">
                    Total: {currency}
                    {order.amount || 0}
                  </p>
                  <p>Payment: {order.payment ? 'Completed' : 'Pending'}</p>
                </div>

                <div className="order-status">
                  <label>Status: </label>
                  <select
                    onChange={(e) => statusHandler(e, order.id)}
                    value={order.status || 'Processing'}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
            );
          })
        ) : (
          <p>No orders found</p>
        )}

        {/* Pagination controls */}
        <div className="pagination-controls">
          {orders.length > 0 && (
            <>
              <button
                onClick={() => handlePageChange('prev')}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Previous
              </button>
              <span className="page-indicator">Page {currentPage}</span>
              <button
                onClick={() => handlePageChange('next')}
                disabled={currentPage * itemsPerPage >= orders.length}
                className="pagination-btn"
              >
                Next
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;

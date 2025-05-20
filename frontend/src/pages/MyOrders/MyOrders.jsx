import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, CreditCard, Clock } from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.post('http://localhost:4000/api/order/userorders', {}, {
      headers: { token }
    })
    .then(response => {
      const data = response.data;
      setOrders(Array.isArray(data.data) ? data.data : []);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching orders:', error);
      setLoading(false);
    });
  }, []);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  const getStatusBadge = (status) => {
    const base = "text-xs px-2 py-1 rounded-full font-medium";
    switch (status) {
      case 'completed': return <span className={`${base} bg-green-100 text-green-700`}><CheckCircle size={14} className="inline mr-1" /> Completed</span>;
      case 'pending': return <span className={`${base} bg-yellow-100 text-yellow-700`}><Clock size={14} className="inline mr-1" /> Pending</span>;
      case 'cancelled': return <span className={`${base} bg-red-100 text-red-700`}><XCircle size={14} className="inline mr-1" /> Cancelled</span>;
      default: return <span className={`${base} bg-gray-100 text-gray-700`}>{status}</span>;
    }
  };

  const getPaymentBadge = (payment) => {
    const base = "text-xs px-2 py-1 rounded-full font-medium bg-blue-100 text-blue-700";
    return <span className={base}><CreditCard size={14} className="inline mr-1" /> {payment}</span>;
  };

  if (loading) return <p className="text-center text-gray-600">Loading orders...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">🛒 My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders found.</p>
      ) : (
        <div className="space-y-8">
          {orders.map((order, index) => {
            const parsedItems = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;

            return (
              <div key={index} className="border rounded-xl shadow-sm p-6 bg-white hover:shadow-lg transition">
                <div className="flex justify-between flex-wrap gap-2 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Order #{order.id}</h3>
                    <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    {getStatusBadge(order.status)}
                    {getPaymentBadge(order.payment)}
                    <span className="text-sm font-bold text-gray-800">{formatCurrency(order.amount)}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Items</h4>
                  {parsedItems && parsedItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {parsedItems.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 border rounded-md p-3 bg-gray-50">
                          <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-sm font-semibold text-gray-600">
                            {item.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.quantity} × {formatCurrency(item.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No items found in this order.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;

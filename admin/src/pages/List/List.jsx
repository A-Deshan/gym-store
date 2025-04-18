import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { url } from '../../assets/assets';
import './List.css';
const List = () => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/product/list`, {
        headers: { token: localStorage.getItem('adminToken') },
      });

      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error('Error fetching products');
      }
    } catch (error) {
      toast.error('Failed to fetch products');
    }
  };

  const removeProduct = async (productId) => {
    try {
      const response = await axios.post(
        `${url}/api/product/remove`,
        { id: productId },
        { headers: { token: localStorage.getItem('adminToken') } }
      );

      if (response.data.success) {
        await fetchList();
        toast.success('Product removed');
      } else {
        toast.error('Error removing product');
      }
    } catch (error) {
      toast.error('Failed to remove product');
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Products List</p>
      <div className="list-table">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr key={item.id}>
                <td><img src={`${url}/uploads/${item.image}`} alt={item.name} width="50" /></td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>${item.price}</td>
                <td><button onClick={() => removeProduct(item.id)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  );
};

export default List;

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { url } from '../../assets/assets';
import './Add.css';

const Add = () => {
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Weights',
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', Number(data.price));
    formData.append('category', data.category);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axios.post(`${url}/api/product/add`, formData, {
        headers: { token: localStorage.getItem('adminToken') },
      });

      if (response.data.success) {
        setData({ name: '', description: '', price: '', category: 'Weights' });
        setImage(null);
        toast.success('Product Added');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to add product');
    }
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" accept="image/*" required />
        </div>
        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input onChange={onChangeHandler} value={data.name} type="text" name="name" placeholder="Type here" required />
        </div>
        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder="Write content here" required />
        </div>
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select onChange={onChangeHandler} name="category" value={data.category}>
              <option value="Weights">Weights</option>
              <option value="Supplements">Supplements</option>
              <option value="Apparel">Apparel</option>
              <option value="Equipment">Equipment</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product Price</p>
            <input onChange={onChangeHandler} value={data.price} type="number" name="price" placeholder="$20" required />
          </div>
        </div>
        <button type="submit" className="add-btn">ADD</button>
      </form>
    </div>
  );
};

export default Add;

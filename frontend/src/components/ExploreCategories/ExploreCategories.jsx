import React, { useContext, useEffect, useState } from 'react';
import './ExploreCategories.css';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';

const ExploreCategories = ({ category, setCategory }) => {
  const { url } = useContext(StoreContext);
  const [categoryList, setCategoryList] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${url}/api/product/list`);
      const products = response.data.data;

      const categoryMap = {};

      // Extract unique categories with images
      products.forEach((item) => {
        const cat = item.category?.trim();
        if (cat && cat !== '') {
          if (!categoryMap[cat]) {
            categoryMap[cat] = item.image;
          }
        }
      });

      const categoryArray = [
        { name: 'All', image: '/all.jpg' }, 
        ...Object.entries(categoryMap).map(([name, image]) => ({
          name,
          image: `${url}/images/${image}`,
        })),
      ];

      setCategoryList(categoryArray);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className='explore-categories' id='explore-categories'>
      <h1>Explore Gym Categories</h1>
      <p className='explore-categories-text'>
        Browse our wide range of gym products by category to find exactly what you need for your fitness journey.
      </p>
      <div className='explore-categories-list'>
        {categoryList.map((item, index) => (
          <div
            key={index}
            className='explore-categories-item'
            onClick={() => setCategory(item.name)}
          >
            <img
              src={item.image}
              alt={item.name}
              className={category === item.name ? 'active' : ''}
            />
            <p>{item.name}</p>
          </div>
        ))}
      </div>
      <hr />
    </div>
  );
};

export default ExploreCategories;

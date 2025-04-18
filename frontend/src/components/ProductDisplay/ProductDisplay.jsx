import React, { useContext } from 'react';
import './ProductDisplay.css';
import ProductItem from '../ProductItem/ProductItem';
import { StoreContext } from '../../Context/StoreContext';

const ProductDisplay = ({ category }) => {
  const { product_list } = useContext(StoreContext);

  return (
    <div className='product-display' id='product-display'>
      <h2>Top Gym Products for You</h2>
      <div className='product-display-list'>
        {product_list?.map((item) => {
          if (category === "All" || category === item.category) {
            return (
              <ProductItem
                key={item.id}
                id={item.id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default ProductDisplay;

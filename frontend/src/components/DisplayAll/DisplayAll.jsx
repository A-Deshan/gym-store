import React, { useContext, useState, forwardRef, useImperativeHandle } from 'react';
import './DisplayAll.css';
import { StoreContext } from '../../Context/StoreContext';
import ProductItem from '../ProductItem/ProductItem';

const DisplayAll = forwardRef(({ category }, ref) => {
  const { product_list } = useContext(StoreContext);
  const [searchTerm, setSearchTerm] = useState("");

  // Expose focus method to parent
  useImperativeHandle(ref, () => ({
    focusSearchBar: () => {
      searchInputRef.current?.focus();
      searchInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },
  }));

  const searchInputRef = React.useRef();

  const filteredProducts = product_list.filter((item) => {
    const matchCategory = category === "All" || item.category === category;
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="display-all" id="display-all">
      <h2>All Gym Products</h2>
      <input
        ref={searchInputRef}
        type="text"
        placeholder="Search products..."
        className="search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="product-display-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
            <ProductItem
              key={item.id}
              id={item.id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
});

export default DisplayAll;

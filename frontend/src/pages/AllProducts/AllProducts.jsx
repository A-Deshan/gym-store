import React, { useRef, useState } from 'react';
import Header from '../../components/Header/Header';
import ExploreCategories from '../../components/ExploreCategories/ExploreCategories';
import DisplayAll from '../../components/DisplayAll/DisplayAll';
import AppDownload from '../../components/AppDownload/AppDownload';

const AllProducts = () => {
  const [category, setCategory] = useState("All");
  const displayAllRef = useRef();

  // Listen for a custom event to trigger focus
  React.useEffect(() => {
    const handleSearchFocus = () => {
      displayAllRef.current?.focusSearchBar();
    };
    window.addEventListener('trigger-search-focus', handleSearchFocus);
    return () => {
      window.removeEventListener('trigger-search-focus', handleSearchFocus);
    };
  }, []);

  return (
    <>
      <Header />
      <DisplayAll ref={displayAllRef} category={category} />
    </>
  );
};

export default AllProducts;

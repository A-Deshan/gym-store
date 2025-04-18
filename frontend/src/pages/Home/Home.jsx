import React, { useState } from 'react'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreCategories/ExploreCategories'
import ProductDisplay from "../../components/ProductDisplay/ProductDisplay";
import AppDownload from '../../components/AppDownload/AppDownload'
import ProductItem from '../../components/ProductItem/ProductItem';

const Home = () => {

  const [category,setCategory] = useState("All")

  return (
    <>
      <Header/>
      <ExploreMenu setCategory={setCategory} category={category}/>
      <ProductDisplay category={category}/>
      <AppDownload/>
    </>
  )
}

export default Home

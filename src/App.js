import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Header from './components/Header';
import MainMenu from './components/MainMenu';
import CreateProduct from './CreateProduct';
import Footer from './components/Footer';
import BulkUpload from './BulkUpload';
import CategoriesProducts from './CategoriesProducts';
import ProductList from './components/ProductList';
import CategoryList from './components/CategoryList';
import CreateCategory from './CreateCategory';
import './App.css';

const App = () => {
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  console.log('userId:', userId);



  // useEffect(() => {
  //   const handleStorageChange = () => {
  //     setUserId(localStorage.getItem('userId'));
  //   };

  //   window.addEventListener('storage', handleStorageChange);

  //   return () => {
  //     // window.removeEventListener('storage', handleStorageChange);
  //   };
  // }, []);

  return (
    <Router>
      <div className="app-container">
        <Header userId={userId} />
        {userId && <MainMenu />}
        <Routes>
          <Route path="" element={<Login/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          {/* {userId && ( */}
            {/* <> */}
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/create" element={<CreateProduct />} />
              <Route path="/bulk-upload" element={<BulkUpload />} />
              <Route path="/categories" element={<CategoryList />} />
              <Route path="/categories-products" element={<CategoriesProducts />} />
              <Route path="/categories/create" element={<CreateCategory />} />
            {/* </> */}
          {/* )} */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};


export default App;

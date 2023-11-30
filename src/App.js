// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './UserContext';
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
  return (
    <UserProvider>
      <Router>
        <div className="app-container">
          <Header />
          <MainMenu />
          <div className="content-area">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/home" element={<Home />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/create" element={<CreateProduct />} />
              <Route path="/bulk-upload" element={<BulkUpload />} />
              <Route path="/categories" element={<CategoryList />} />
              <Route path="/categories-products" element={<CategoriesProducts />} />
              <Route path="/categories/create" element={<CreateCategory />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </UserProvider>
  );
};

export default App;

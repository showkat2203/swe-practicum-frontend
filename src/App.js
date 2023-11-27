import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Header from './components/Header';
import MainMenu from './components/MainMenu';
import CreateProduct from './CreateProduct';
import Footer from './components/Footer';
import { UserProvider } from './UserContext';
import BulkUpload from './BulkUpload'; 
import './App.css';
import CategoriesProducts from './CategoriesProducts';


const App = () => {
  return (
    <UserProvider>
      <Router>
      <div className="app-container">

        <Header />
        <MainMenu />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/products/create" element={<CreateProduct />} /> 
          <Route path="/bulk-upload" element={<BulkUpload />} />
          <Route path="/categories-products" element={<CategoriesProducts />} />

        </Routes>
        <Footer />
        </div>

      </Router>
    </UserProvider>
  );
};

export default App;

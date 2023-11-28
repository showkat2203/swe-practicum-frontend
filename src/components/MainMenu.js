import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainMenu = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className="main-menu">
      <ul>
        <li className="menu-item">
          <div onClick={() => handleNavigation('/products')}>Products</div>
          <div className="submenu">
            <button onClick={() => handleNavigation('/products/create')}>Add Product</button>
            <button onClick={() => handleNavigation('/categories-products')}>View Products</button>
          </div>
        </li>
        <li className="menu-item">
          <div onClick={() => handleNavigation('/categories')}>Categories</div>
          <div className="submenu">
            <button onClick={() => handleNavigation('/categories/create')}>Add Category</button>
            <button onClick={() => handleNavigation('/categories')}>View Categories</button>
            <button onClick={() => handleNavigation('/categories-products')}>View Products with Categories</button>
          </div>
        </li>
        <li>
          <button onClick={() => handleNavigation('/bulk-upload')}>Bulk Upload</button>
        </li>
      </ul>
    </nav>
  );
};

export default MainMenu;

import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';
import './CreateProduct.css';

const CreateProduct = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(new Map());
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !user.userId) {
      navigate('/login');
      return;
    }

    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8080/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [navigate, user]);

  const handleCategoryChange = (categoryId, categoryName) => {
    const newSelectedCategories = new Map(selectedCategories);
    if (categoryId === '') {
      newSelectedCategories.clear();
    } else {
      if (newSelectedCategories.size < 3 || newSelectedCategories.has(categoryId)) {
        newSelectedCategories.has(categoryId) ? newSelectedCategories.delete(categoryId) : newSelectedCategories.set(categoryId, categoryName);
      } else {
        alert('You can only select up to 3 categories.');
        return;
      }
    }
    setSelectedCategories(newSelectedCategories);
  };

  // const renderSelectedCategoryNames = () => {
  //   return Array.from(selectedCategories.entries())
  //     .map(([key, value]) => value || `Category ID: ${key}`)
  //     .join(', ');
  // }

  const renderSelectedCategoryNames = () => {
    return (
      <div className="selected-categories">
        {Array.from(selectedCategories.entries()).map(([key, value]) => (
          <span key={key} className="selected-category">
            {value || `Category ID: ${key}`}
            <span 
              className="remove-category"
              onClick={(e) => {
                e.stopPropagation(); // Prevents triggering the dropdown
                handleCategoryChange(key, value);
              }}
            > ✖</span>
          </span>
        ))}
      </div>
    );
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const categoryIds = Array.from(selectedCategories.keys());

    try {
      const productData = {
        userId: user.userId,
        productName,
        description
      };

      const createResponse = await fetch('http://localhost:8080/products/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      if (!createResponse.ok) {
        const errorMsg = await createResponse.text();
        setError(errorMsg);
        return;
      }

      const createdProduct = await createResponse.json();

      if (categoryIds.length) {
        const linkData = {
          productId: createdProduct.productId,
          categoryIds
        };

        await fetch('http://localhost:8080/products/link-categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(linkData)
        });
      }

      navigate('/');
    } catch (error) {
      setError('An error occurred while creating the product.');
    }
  };


  return (
    <div className="create-product-container">
      <h2>Create Product</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="productName">Product Name</label>
          <input 
            type="text" 
            id="productName" 
            value={productName} 
            onChange={(e) => setProductName(e.target.value)} 
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea 
            id="description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            required
          />
        </div>
        <div className="form-group">
          <label>Link to Categories (optional)</label>
          <div className="custom-dropdown" onClick={() => setShowDropdown(!showDropdown)}>
            {/* <div className="dropdown-header">{selectedCategories.size === 0 ? 'No Category' : renderSelectedCategoryNames()}</div> */}

            <div className="dropdown-header" onClick={() => setShowDropdown(!showDropdown)}>
                {selectedCategories.size === 0 ? 'No Category' : renderSelectedCategoryNames()}
            </div>
            
            {showDropdown && (
              <ul className="dropdown-list">
                <li onClick={() => handleCategoryChange('', 'No Category')}>No Category</li>
                {categories.map(category => (
                  <li key={category.categoryId} onClick={() => handleCategoryChange(category.categoryId, category.name)}>
                    {selectedCategories.has(category.categoryId) ? '✔ ' : ''}
                    {category.name || `Category ID: ${category.categoryId}`}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <button type="submit" className="submit-btn">Create Product</button>
      </form>
    </div>
  );
};

export default CreateProduct;

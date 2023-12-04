import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateProduct.css';

const CreateProduct = ({ closeModal, productData }) => {
  const navigate = useNavigate();
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(new Map());
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/');
      return;
    }

    if (productData) {
      setProductName(productData.productName);
      setDescription(productData.description);
      // Preload saved categories for the product
      fetchSavedCategories(productData.productId);
    }

    fetchCategories();
  }, [navigate, productData]);

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

  const fetchSavedCategories = async (productId) => {
    try {
      const response = await fetch(`http://localhost:8080/products/${productId}/categories`);
      if (response.ok) {
        const savedCategories = await response.json();
        const categoriesMap = new Map();
        savedCategories.forEach(category => {
          categoriesMap.set(category.categoryId, category.name);
        });
        setSelectedCategories(categoriesMap);
      }
    } catch (error) {
      console.error('Error fetching saved categories:', error);
    }
  };

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

    const userId = localStorage.getItem('userId');
    const categoryIds = Array.from(selectedCategories.keys());
    let productResponse, linkResponse;

    // Prepare product data payload
    const productDataPayload = {
        userId: userId,
        productName,
        description
    };

    try {
        if (productData && productData.productId) { // Update existing product
            productResponse = await fetch(`http://localhost:8080/products/${productData.productId}/edit`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productDataPayload)
            });
        } else { // Create new product
            productResponse = await fetch('http://localhost:8080/products/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productDataPayload)
            });
        }

        // if (!productResponse.ok) throw new Error('Product processing failed');

        if (!productResponse.ok) {
          const errorMsg = await productResponse.text(); 
          throw new Error(errorMsg || 'Product processing failed');
      }

        const productResult = await productResponse.json();
        const productId = productResult.productId;

        // Link categories to the product
        if (categoryIds.length) {
            const linkData = { productId, categoryIds };
            linkResponse = await fetch('http://localhost:8080/products/link-categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(linkData)
            });

            if (!linkResponse.ok) throw new Error('Category linking failed');
        }

        // closeModal(); // Close modal on success
        navigate('/products');
    } catch (error) {
        setError('An error occurred: ' + error.message);
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
        {/* <button type="submit" className="submit-btn">Create Product</button>
         */}
         <button type="submit" className="submit-btn">
          {productData ? 'Update Product' : 'Create Product'}
        </button>
      </form>
      <button onClick={closeModal}>Close</button>

    </div>
  );
};

export default CreateProduct;

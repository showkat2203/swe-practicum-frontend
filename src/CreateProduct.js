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
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect to login page if user is not logged in
    if (!user || !user.userId) {
      navigate('/login');
      return;
    }

    // Fetch categories
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    // Check for product name duplication
    // Placeholder for duplication check API call
    const isDuplicate = false;
    if (isDuplicate) {
      setError('Product name already exists.');
      return;
    }

    // Limit category selection to 3
    if (selectedCategories.length > 3) {
      setError('You can only link up to 3 categories.');
      return;
    }

    // Create product
    try {
      const productData = {
        userId: user.userId,
        productName,
        description
      };
      // Replace with actual API call
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

      // Link product to categories if any
      if (selectedCategories.length) {
        const linkData = {
          productId: createdProduct.productId,
          categoryIds: selectedCategories
        };
        // Replace with actual API call
        await fetch('http://localhost:8080/products/link-categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(linkData)
        });
      }

      navigate('/'); // Redirect after successful creation
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
          <label htmlFor="categories">Link to Categories (optional)</label>
          <select 
            id="categories" 
            multiple 
            value={selectedCategories}
            onChange={(e) => setSelectedCategories([...e.target.selectedOptions].map(o => o.value))}
            size="5"
          >
            <option value="">No Category</option>
            {categories.map(category => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.name || `Category ID: ${category.categoryId}`}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="submit-btn">Create Product</button>
      </form>
    </div>
  );
};

export default CreateProduct;

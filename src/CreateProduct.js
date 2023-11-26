import React, { useState, useContext } from 'react';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';
import './CreateProduct.css'

const CreateProduct = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Assuming a function to make POST request here
    const productData = {
      userId: user?.userId, // Getting userId from UserContext
      productName: productName,
      description: description
    };
    console.log(productData); // Replace with API call
    navigate('/'); // Redirect after submission
  };

  return (
    <div className="create-product-container">
      <h2>Create Product</h2>
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
        <button type="submit" className="submit-btn">Create Product</button>
      </form>
    </div>
  );
};

export default CreateProduct;

import React, { useState } from 'react';
import './CreateCategory.css';

const CreateCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8080/categories/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: categoryName, description: categoryDescription })
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        setError(errorMsg);
      } else {
        setSuccess('Category created successfully');
        setCategoryName('');
        setCategoryDescription('');
      }
    } catch (error) {
      setError('An error occurred while creating the category');
    }
  };

  return (
    <div className="create-category-container">
      <h2>Create Category</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="categoryName">Category Name</label>
          <input 
            type="text" 
            id="categoryName" 
            value={categoryName} 
            onChange={(e) => setCategoryName(e.target.value)} 
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="categoryDescription">Description</label>
          <textarea 
            id="categoryDescription" 
            value={categoryDescription} 
            onChange={(e) => setCategoryDescription(e.target.value)}
          />
        </div>
        <button type="submit" className="submit-btn">Create Category</button>
      </form>
    </div>
  );
};

export default CreateCategory;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateCategory.css';

const CreateCategory = ({ categoryData, onClose, onActionComplete }) => {
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Create navigate instance


  useEffect(() => {
    if (categoryData) {
      setCategoryName(categoryData.name);
      setCategoryDescription(categoryData.description);
    } else {
      setCategoryName('');
      setCategoryDescription('');
    }
  }, [categoryData]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const endpoint = categoryData ? `/categories/${categoryData.categoryId}/edit` : '/categories/create';
    const method = categoryData ? 'PUT' : 'POST';

    try {
      const response = await fetch(`http://localhost:8080${endpoint}`, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: categoryName, description: categoryDescription })
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        setError(errorMsg);
      } else {
        if (onActionComplete) onActionComplete(); // Refresh categories list (only for edit mode)
        if (onClose) onClose(); // Close modal (only for edit mode)

        navigate('/categories');
      }
    } catch (error) {
      setError(`An error occurred while ${categoryData ? 'updating' : 'creating'} the category`);
    }
  };

  // Render differently based on the context (Create or Edit)
  const isEditMode = categoryData != null;

  return (
    <div className={`${isEditMode ? 'modal-backdrop' : ''}`}>
      {isEditMode && <span className="close-modal-button" onClick={onClose}>✖</span>}
      <div className="create-category-container">
        <h2>{isEditMode ? 'Edit Category' : 'Create Category'}</h2>
        {error && <div className="error-message">{error}</div>}
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
          <button type="submit" className="submit-btn">
            {isEditMode ? 'Update Category' : 'Create Category'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCategory;

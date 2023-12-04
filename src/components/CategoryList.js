import React, { useState, useEffect } from 'react';
import CreateCategory from '../CreateCategory';
import './CategoryList.css';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editableCategory, setEditableCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const openEditModal = (category) => {
    setEditableCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditableCategory(null);
    fetchCategories(); // Refresh categories list
  };

  return (
    <div className="category-list-container">
      <table className="category-table">
        <thead>
          <tr>
            <th>Category Name</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr key={category.categoryId}>
              <td>{category.name || `Category ID: ${category.categoryId}`}</td>
              <td>{category.description || 'No Description'}</td>
              <td>
                <button onClick={() => openEditModal(category)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <CreateCategory
          categoryData={editableCategory}
          onClose={closeModal}
          onActionComplete={fetchCategories}
        />
      )}
    </div>
  );
};

export default CategoryList;

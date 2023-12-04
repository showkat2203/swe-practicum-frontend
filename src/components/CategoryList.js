import React, { useState, useEffect } from 'react';
import CreateCategory from '../CreateCategory';
import './CategoryList.css';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editableCategory, setEditableCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredCategories = categories.filter(category => {
    const name = category.name ? category.name.toLowerCase() : `Category ID: ${category.categoryId}`;
    const description = category.description ? category.description.toLowerCase() : '';
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
  
    return name.includes(lowerCaseSearchTerm) || description.includes(lowerCaseSearchTerm);
  });
  

  const openEditModal = (category) => {
    setEditableCategory(category);
    setIsModalOpen(true);
  };

  const openDeleteModal = (categoryId) => {
    setCategoryToDelete(categoryId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`http://localhost:8080/categories/delete/${categoryToDelete}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete the category.');
      setIsDeleteModalOpen(false);
      fetchCategories(); // Refresh categories list after deletion
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditableCategory(null);
    fetchCategories(); // Refresh categories list
  };

  return (
    <div className="category-list-container">
      <input 
        type="text" 
        placeholder="Search by name or description..." 
        onChange={handleSearchChange} 
        className="search-input"
      />
      <table className="category-table">
        <thead>
          <tr>
            <th>Category Name</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.map(category => (
            <tr key={category.categoryId}>
              <td>{category.name || `Category ID: ${category.categoryId}`}</td>
              <td>{category.description || 'No Description'}</td>
              <td>
                <button onClick={() => openEditModal(category)}>Edit</button>
                <button onClick={() => openDeleteModal(category.categoryId)}>Delete</button>
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
      {isDeleteModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <span className="close-modal-button" onClick={() => setIsDeleteModalOpen(false)}>✖</span>
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this category?</p>
            <button onClick={handleDeleteConfirm}>Delete</button>
            <button onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;

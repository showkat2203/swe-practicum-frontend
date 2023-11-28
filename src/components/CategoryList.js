import React, { useEffect, useState } from 'react';
import './CategoryList.css';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
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

    fetchCategories();
  }, []);

  const handleEdit = (categoryId) => {
    console.log("Edit Category:", categoryId);
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
                <button onClick={() => handleEdit(category.categoryId)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryList;

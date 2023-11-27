import React, { useState, useEffect } from 'react';
import './CategoriesProducts.css';

const CategoriesProducts = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortDirection, setSortDirection] = useState({ field: 'categoryName', direction: 'asc' });
  const productsPerPage = 20;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8080/products/categories');
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
  }, []);

  const handleCategoryChange = (e) => {
    const selectedOptions = new Set([...e.target.selectedOptions].map(option => option.value));
    setSelectedCategories(selectedOptions);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    const newDirection = sortDirection.field === field && sortDirection.direction === 'asc' ? 'desc' : 'asc';
    setSortDirection({ field, direction: newDirection });
  };

  const getSortIndicator = (field) => {
    return sortDirection.field === field ? (sortDirection.direction === 'asc' ? ' ↓' : ' ↑') : '';
  };

  const applySortAndFilter = () => {
    return categories
      .flatMap(category => category.products.map(product => ({
        ...product,
        categoryName: category.name || `Category ID: ${category.categoryId}`
      })))
      .filter(product => 
        (selectedCategories.size === 0 || selectedCategories.has('All') || selectedCategories.has(product.categoryName)) &&
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (!sortDirection.field) return 0;
        const order = sortDirection.direction === 'asc' ? 1 : -1;
        return a[sortDirection.field].localeCompare(b[sortDirection.field]) * order;
      });
  };

  const filteredAndSortedProducts = applySortAndFilter();
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredAndSortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (event, pageNumber) => {
    event.preventDefault();
    setCurrentPage(pageNumber);
  };

  return (
    <div className="categories-products-container">
      <h2>Products Grouped by Categories</h2>
      <div className="filters">
        <input 
          type="text" 
          placeholder="Search by product name..." 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        <select multiple onChange={handleCategoryChange} size="5">
          <option value="All">All Categories</option>
          {categories.map(category => (
            <option key={category.categoryId} value={category.name || `Category ID: ${category.categoryId}`}>
              {category.name || `Category ID: ${category.categoryId}`}
            </option>
          ))}
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('categoryName')}>
              Category{getSortIndicator('categoryName')}
            </th>
            <th onClick={() => handleSort('productName')}>
              Product Name{getSortIndicator('productName')}
            </th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product, index) => (
            <tr key={index}>
              <td>{product.categoryName}</td>
              <td>{product.productName}</td>
              <td>{product.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination 
        productsPerPage={productsPerPage} 
        totalProducts={filteredAndSortedProducts.length} 
        paginate={paginate}
      />
    </div>
  );
};

const Pagination = ({ productsPerPage, totalProducts, paginate }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className='pagination'>
        {pageNumbers.map(number => (
          <li key={number} className='page-item'>
            <a onClick={(e) => paginate(e, number)} href="#" className='page-link'>
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default CategoriesProducts;

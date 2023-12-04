import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoriesProducts.css';
import CreateProduct from './CreateProduct';




const CategoriesProducts = () => {
  const [userId, setUserId] = useState(localStorage.getItem('id'));
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(new Set(['All']));
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortDirection, setSortDirection] = useState({ field: 'categoryName', direction: 'asc' });
  const productsPerPage = 20;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editableProduct, setEditableProduct] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteCounter, setDeleteCounter] = useState(0); // Counter for deletions



  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleDeleteConfirm = async (productId) => {
    try {
      const response = await fetch(`http://localhost:8080/products/delete/${productId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete the product.');
      setDeleteCounter(prev => prev + 1); // Increment the delete counter
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleView = (productId) => {
    // Logic to view product details
  };

  const handleEdit = (product) => {
    setEditableProduct(product);
    setIsModalOpen(true);
  };

  
  const closeModal = () => {
    setIsModalOpen(false);
    setEditableProduct(null);
  };

  useEffect(() => {

    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('');
      return;
    }

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
  }, [navigate, deleteCounter]);

  // const handleDelete = async (productId) => {
  //   if (window.confirm("Are you sure you want to delete this product?")) {
  //     try {
  //       const response = await fetch(`http://localhost:8080/products/delete/${productId}`, {
  //         method: 'DELETE'
  //       });
  //       if (!response.ok) throw new Error('Failed to delete the product.');
  //     } catch (error) {
  //       console.error('Error deleting product:', error);
  //     }
  //   }
  // };


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
        (selectedCategories.has('All') || selectedCategories.has(product.categoryName)) &&
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


  let lastCategory = null;


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
            <th>Action</th>

          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product, index) => {
            const isDifferentCategory = lastCategory !== product.categoryName;
            lastCategory = product.categoryName; 

            return (
              <React.Fragment key={index}>
               {isDifferentCategory && (
                  <tr className="category-separator">
                    <td colSpan="3">{product.categoryName}</td> 
                  </tr>
                )}
                <tr>
                  <td>{product.categoryName}</td>
                  <td>{product.productName}</td>
                  <td>{product.description}</td>
                  <td>
                    <button onClick={() => handleView(product.productId)}>View</button>
                    <button onClick={() => handleEdit(product)}>Edit</button>
                    <button onClick={() => handleDeleteClick(product.productId)}>Delete</button>
                </td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      <Pagination 
        productsPerPage={productsPerPage} 
        totalProducts={filteredAndSortedProducts.length} 
        paginate={paginate}
      />
      {/* {isModalOpen && (
        <CreateProduct
          closeModal={closeModal}
          productData={editableProduct}
        />
      )} */}

    {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <span className="close-modal-button" onClick={closeModal}>✖</span>
            <CreateProduct
              closeModal={closeModal}
              productData={editableProduct}
            />
          </div>
        </div>
      )}

      <DeleteConfirmationModal 
          isOpen={isDeleteModalOpen} 
          onClose={closeDeleteModal}
          onConfirm={handleDeleteConfirm} 
          productId={productToDelete}
        />

    </div>
  );
};


const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, productId }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <span className="close-modal-button" onClick={onClose}>✖</span>
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to delete this product?</p>
        <button onClick={() => onConfirm(productId)}>Delete</button>
        <button onClick={onClose}>Cancel</button>
      </div>
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

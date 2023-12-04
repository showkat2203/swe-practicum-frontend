import React, { useEffect, useState } from 'react';
import CreateProduct from '../CreateProduct';
import './ProductList.css'; 

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editableProduct, setEditableProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');


  

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`http://localhost:8080/products/delete/${productToDelete}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete the product.');
      setIsDeleteModalOpen(false);
      fetchProducts(); // Refresh products list after deletion
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredProducts = products.filter(product => 
    product.productName.toLowerCase().includes(searchTerm) || 
    product.description.toLowerCase().includes(searchTerm)
  );

  const openEditModal = (product) => {
    setEditableProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditableProduct(null);
    fetchProducts();
  };

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="product-list-container">
      <input 
        type="text" 
        placeholder="Search by name or description..." 
        onChange={handleSearchChange} 
        className="search-input"
      />
      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(product => (
            <tr key={product.productId}>
              <td>{product.productName}</td>
              <td>{product.description}</td>
              <td>
                <button className="edit-btn" onClick={() => openEditModal(product)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDeleteClick(product.productId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <span className="close-modal-button" onClick={closeModal}>✖</span>
            <CreateProduct
              productData={editableProduct}
              closeModal={closeModal}
            />
          </div>
        </div>
      )}
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          productId={productToDelete}
        />
      )}
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

export default ProductList;

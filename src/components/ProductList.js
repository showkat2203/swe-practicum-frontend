import React, { useEffect, useState } from 'react';
import './ProductList.css'; 

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
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

    fetchProducts();
  }, []);

  return (
    <div className="product-list-container">
      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.productId}>
              <td>{product.productName}</td>
              <td>{product.description}</td>
              <td><button className="edit-btn">Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;

import React, { useEffect, useState } from 'react';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from API and setProducts
  }, []);

  return (
    <div>
      {products.map(product => (
        <div key={product.productId}>
          <h3>{product.productName}</h3>
          <p>{product.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductList;

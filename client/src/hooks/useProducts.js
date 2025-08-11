import { useState, useEffect } from 'react';
import { productAPI } from '../services/api';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await productAPI.getAllProducts();
      setProducts(response.data.products || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  const getProductById = (id) => {
    return products.find(product => product._id === id || product.id === parseInt(id));
  };

  const addProduct = async (productData) => {
    try {
      const formData = new FormData();
      
      Object.keys(productData).forEach(key => {
        if (key === 'images' && Array.isArray(productData[key])) {
          productData[key].forEach((image) => {
            formData.append('images', image);
          });
        } else if (key !== 'images') {
          formData.append(key, productData[key]);
        }
      });

      const response = await productAPI.createProduct(formData);
      
      setProducts(prev => [response.data, ...prev]);
      
      return { success: true, product: response.data };
    } catch (err) {
      console.error('Failed to add product:', err);
      throw new Error(err.message || 'Failed to add product');
    }
  };

  const searchProducts = (query, category = 'All') => {
    return products.filter(product => {
      const matchesQuery = product.productName.toLowerCase().includes(query.toLowerCase()) ||
                          product.description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === 'All' || product.category === category;
      
      return matchesQuery && matchesCategory;
    });
  };

  const filterProductsByPrice = (products, minPrice = 0, maxPrice = Infinity) => {
    return products.filter(product => 
      product.productPrice >= minPrice && product.productPrice <= maxPrice
    );
  };

  return {
    products,
    isLoading,
    error,
    getProductById,
    addProduct,
    searchProducts,
    filterProductsByPrice,
    refetch: fetchProducts
  };
};
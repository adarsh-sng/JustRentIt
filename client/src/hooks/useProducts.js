import { useState, useEffect } from 'react';
import { products as staticProducts } from '../data/products';

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
      // Simulate API call - replace with actual API later
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get user-listed items from localStorage
      const userListedItems = JSON.parse(localStorage.getItem('userListedItems') || '[]');
      
      // Combine static products with user-listed items
      const allProducts = [...staticProducts, ...userListedItems];
      
      setProducts(allProducts);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  const getProductById = (id) => {
    return products.find(product => product.id === parseInt(id));
  };

  const addProduct = async (productData) => {
    try {
      // Simulate API call - replace with actual API later
      const newProduct = {
        id: Date.now(),
        ...productData,
        createdAt: new Date().toISOString()
      };

      // Add to local storage
      const userListedItems = JSON.parse(localStorage.getItem('userListedItems') || '[]');
      userListedItems.push(newProduct);
      localStorage.setItem('userListedItems', JSON.stringify(userListedItems));

      // Update local state
      setProducts(prev => [...prev, newProduct]);
      
      return { success: true, product: newProduct };
    } catch (err) {
      console.error('Failed to add product:', err);
      throw new Error('Failed to add product');
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
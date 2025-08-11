import { useState, useEffect } from 'react';
import { productAPI } from '../services/api';

export const useCategories = () => {
  const [categories, setCategories] = useState(['All']); // Start with 'All' for filtering
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await productAPI.getCategories();
      // Add 'All' at the beginning for filtering purposes
      setCategories(['All', ...response.data]);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('Failed to fetch categories');
      // Fallback to default categories if API fails
      setCategories(['All', 'Electronics', 'Sports', 'Books', 'Vehicles', 'Fashion', 'Home & Garden', 'Tools', 'Music', 'Gaming', 'Outdoor', 'Others']);
    } finally {
      setIsLoading(false);
    }
  };

  // Return categories without 'All' for forms (like ListItemPage)
  const categoriesForForm = categories.filter(cat => cat !== 'All');

  return {
    categories, // Includes 'All' for filtering
    categoriesForForm, // Excludes 'All' for forms
    isLoading,
    error,
    refetch: fetchCategories
  };
};

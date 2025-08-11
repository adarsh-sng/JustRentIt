import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../hooks/useAuth";
import { Button, Input, Card } from '../components/ui';
import { categories } from '../data/products';

const ListItemPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    productName: '',
    productPrice: '',
    category: '',
    description: '',
    availability: 'In Stock',
    pickup: 'Same day available'
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.productName.trim()) newErrors.productName = 'Product name is required';
    if (!formData.productPrice) newErrors.productPrice = 'Price is required';
    if (isNaN(formData.productPrice) || formData.productPrice <= 0) {
      newErrors.productPrice = 'Price must be a valid positive number';
    }
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call - replace with actual API later
      const newItem = {
        id: Date.now(),
        ...formData,
        productPrice: parseFloat(formData.productPrice),
        ownerId: user.id,
        ownerName: user.name,
        createdAt: new Date().toISOString()
      };

      // Add to local storage for now (will be replaced with API call)
      const existingItems = JSON.parse(localStorage.getItem('userListedItems') || '[]');
      existingItems.push(newItem);
      localStorage.setItem('userListedItems', JSON.stringify(existingItems));

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      navigate('/rental-shop', { 
        state: { 
          message: 'Item listed successfully! It will be reviewed and published soon.' 
        }
      });
    } catch (error) {
      console.error('Failed to list item:', error);
      setErrors({ general: 'Failed to list item. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">List Your Item</h1>
            <p className="text-gray-600">Share your items with the community and start earning</p>
          </div>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <Input
              label="Product Name"
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="e.g. Canon DSLR Camera"
              error={errors.productName}
              required
            />

            {/* Price and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Daily Rental Price (Rs)"
                type="number"
                name="productPrice"
                value={formData.productPrice}
                onChange={handleChange}
                placeholder="e.g. 50"
                error={errors.productPrice}
                required
                min="1"
                step="1"
              />

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.slice(1).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-sm text-red-600">{errors.category}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your item, its condition, what's included, and any special instructions..."
                className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                rows="4"
                required
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Availability and Pickup */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Availability</label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Limited">Limited Availability</option>
                  <option value="On Request">Available on Request</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Pickup Option</label>
                <select
                  name="pickup"
                  value={formData.pickup}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Same day available">Same Day Available</option>
                  <option value="Next day available">Next Day Available</option>
                  <option value="2-3 days">2-3 Days</option>
                  <option value="On schedule">On Schedule</option>
                </select>
              </div>
            </div>

            {/* Image Upload Placeholder */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Product Images</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Image upload will be available soon</p>
                  <p className="text-xs text-gray-500">For now, your item will be listed with a placeholder image</p>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Important Guidelines</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Ensure your item is in good working condition</li>
                <li>• Set a fair rental price based on market rates</li>
                <li>• Provide accurate descriptions to avoid disputes</li>
                <li>• You're responsible for the item's availability</li>
                <li>• All listings are subject to approval</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/')}
                className="sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={!formData.productName || !formData.productPrice || !formData.category || !formData.description}
                className="flex-1"
              >
                List My Item
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ListItemPage;
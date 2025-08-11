import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../hooks/useAuth";
import { useProducts } from "../hooks/useProducts";
import { Button, Input, Card } from '../components/ui';
import { categories } from '../data/products';

const ListItemPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addProduct } = useProducts();
  
  const [formData, setFormData] = useState({
    productName: '',
    hourlyPrice: '',
    dailyPrice: '',
    category: '',
    description: '',
    availability: 'In Stock',
    pickup: 'Same day available'
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setErrors(prev => ({ ...prev, images: 'only 1 image for now' }));
      return;
    }

    const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setErrors(prev => ({ ...prev, images: 'Each image must be less than 10MB' }));
      return;
    }

    setSelectedImages(files);
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
    
    // Clear any existing image errors
    if (errors.images) {
      setErrors(prev => ({ ...prev, images: '' }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    
    if (files.length > 5) {
      setErrors(prev => ({ ...prev, images: 'Maximum 5 images allowed' }));
      return;
    }

    // Validate file sizes
    const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setErrors(prev => ({ ...prev, images: 'Each image must be less than 10MB' }));
      return;
    }

    setSelectedImages(files);
    
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);

    if (errors.images) {
      setErrors(prev => ({ ...prev, images: '' }));
    }
  };

  const removeImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    URL.revokeObjectURL(imagePreviews[index]);
    
    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.productName.trim()) newErrors.productName = 'Product name is required';
    if (!formData.hourlyPrice) newErrors.hourlyPrice = 'Hourly price is required';
    if (isNaN(formData.hourlyPrice) || formData.hourlyPrice <= 0) {
      newErrors.hourlyPrice = 'Hourly price must be a valid positive number';
    }
    if (!formData.dailyPrice) newErrors.dailyPrice = 'Daily price is required';
    if (isNaN(formData.dailyPrice) || formData.dailyPrice <= 0) {
      newErrors.dailyPrice = 'Daily price must be a valid positive number';
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
      const productData = {
        ...formData,
        hourlyPrice: parseFloat(formData.hourlyPrice),
        dailyPrice: parseFloat(formData.dailyPrice),
        images: selectedImages
      };

      const result = await addProduct(productData);

      // Clean up preview URLs
      imagePreviews.forEach(url => URL.revokeObjectURL(url));

      navigate('/listing-success');
    } catch (error) {
      console.error('Failed to list item:', error);
      setErrors({ general: error.message || 'Failed to list item. Please try again.' });
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

            {/* Price Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Rental Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Hourly Price (Rs)"
                  type="number"
                  name="hourlyPrice"
                  value={formData.hourlyPrice}
                  onChange={handleChange}
                  placeholder="e.g. 50"
                  error={errors.hourlyPrice}
                  required
                  min="1"
                  step="1"
                />

                <Input
                  label="Daily Price (Rs)"
                  type="number"
                  name="dailyPrice"
                  value={formData.dailyPrice}
                  onChange={handleChange}
                  placeholder="e.g. 10"
                  error={errors.dailyPrice}
                  required
                  min="1"
                  step="1"
                />
              </div>
              <p className="text-sm text-gray-500">
                Hourly price is for short-term rentals, daily price is for long-term rentals
              </p>
            </div>

            {/* Category */}
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
                <option value="Others">Others</option>
              </select>
              {errors.category && (
                <p className="text-sm text-red-600">{errors.category}</p>
              )}
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

            {/* Image Upload */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Product Images</label>
              <div className="space-y-4">
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                    max="5"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Click to upload images or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each (only 1 image for now)</p>
                    </div>
                  </label>
                </div>
                
                {errors.images && (
                  <p className="text-sm text-red-600">{errors.images}</p>
                )}
                
                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
                disabled={!formData.productName || !formData.hourlyPrice || !formData.dailyPrice || !formData.category || !formData.description}
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
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Electronics', 'Sports', 'Books', 'Vehicles', 'Fashion', 'Home & Garden', 'Tools', 'Music', 'Gaming', 'Outdoor', 'Others']
  },
  productPrice: {
    type: Number,
    required: [true, 'Daily price is required'],
    min: [1, 'Daily price must be at least 1']
  },
  hourlyPrice: {
    type: Number,
    required: [true, 'Hourly price is required'],
    min: [1, 'Hourly price must be at least 1']
  },
  dailyPrice: {
    type: Number,
    required: [true, 'Daily price is required'],
    min: [1, 'Daily price must be at least 1']
  },
  images: [{
    type: String
  }],
  availability: {
    type: String,
    enum: ['In Stock', 'Limited', 'On Request'],
    default: 'In Stock'
  },
  pickup: {
    type: String,
    enum: ['Same day available', 'Next day available', '2-3 days', 'On schedule'],
    default: 'Same day available'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ownerName: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  rentCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

productSchema.index({ productName: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ owner: 1 });
productSchema.index({ isActive: 1 });

// Export the categories for API use
export const PRODUCT_CATEGORIES = ['Electronics', 'Sports', 'Books', 'Vehicles', 'Fashion', 'Home & Garden', 'Tools', 'Music', 'Gaming', 'Outdoor', 'Others'];

export const Product = mongoose.model('Product', productSchema);
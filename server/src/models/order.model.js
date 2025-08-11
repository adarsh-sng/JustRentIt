import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  productPrice: {
    type: Number,
    required: true
  },
  days: {
    type: Number,
    required: true,
    min: 0.1 // Allow fractional days for hourly rentals
  },
  hours: {
    type: Number,
    default: null // For hourly rentals
  },
  rentalType: {
    type: String,
    enum: ['hourly', 'daily', 'short'],
    default: 'daily'
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['active', 'returned', 'cancelled'],
    default: 'active'
  },
  rentDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  expectedReturnDate: {
    type: Date,
    required: true
  },
  actualReturnDate: {
    type: Date
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  invoiceAddress: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  deliveryAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'completed'
  },
  notes: {
    type: String,
    maxlength: 500
  },
  isCartOrder: {
    type: Boolean,
    default: false
  },
  cartOrderId: {
    type: String,
    default: null // Groups multiple orders from the same cart checkout
  }
}, {
  timestamps: true
});

orderSchema.index({ user: 1 });
orderSchema.index({ product: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ rentDate: -1 });
orderSchema.index({ cartOrderId: 1 });

export const Order = mongoose.model('Order', orderSchema);
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Order } from '../models/order.model.js';
import { Product } from '../models/product.model.js';

const generateOrderId = () => {
  return 'ORD' + Date.now().toString(36).toUpperCase();
};

const createOrder = asyncHandler(async (req, res) => {
  const {
    productId,
    days,
    totalPrice,
    invoiceAddress,
    deliveryAddress,
    notes
  } = req.body;

  if (!productId || !days || !totalPrice || !invoiceAddress) {
    throw new ApiError(400, 'Product ID, days, total price, and invoice address are required');
  }

  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    throw new ApiError(404, 'Product not found or not available');
  }

  if (product.owner.toString() === req.user._id.toString()) {
    throw new ApiError(400, 'You cannot rent your own product');
  }

  const orderId = generateOrderId();
  const rentDate = new Date();
  const expectedReturnDate = new Date(rentDate.getTime() + (days * 24 * 60 * 60 * 1000));
  const deliveryDate = new Date(rentDate.getTime() + (24 * 60 * 60 * 1000));

  const orderData = {
    orderId,
    user: req.user._id,
    product: productId,
    productName: product.productName,
    category: product.category,
    productPrice: product.productPrice,
    days: Math.max(parseFloat(days), 0.1), // Ensure minimum 0.1 days for hourly rentals
    totalPrice: parseFloat(totalPrice),
    rentDate,
    expectedReturnDate,
    deliveryDate,
    invoiceAddress,
    deliveryAddress: deliveryAddress || invoiceAddress,
    notes
  };

  const order = await Order.create(orderData);

  await Product.findByIdAndUpdate(productId, { $inc: { rentCount: 1 } });

  const populatedOrder = await Order.findById(order._id)
    .populate('user', 'name email phone')
    .populate('product', 'productName category images');

  return res
    .status(201)
    .json(new ApiResponse(201, populatedOrder, 'Order created successfully'));
});

const getUserOrders = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 20, status } = req.query;

  const query = { user: userId };
  if (status) {
    query.status = status;
  }

  const orders = await Order.find(query)
    .populate('product', 'productName category images owner')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Order.countDocuments(query);

  return res
    .status(200)
    .json(new ApiResponse(200, {
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    }, 'User orders fetched successfully'));
});

const getMyOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;

  const query = { user: req.user._id };
  if (status) {
    query.status = status;
  }

  const orders = await Order.find(query)
    .populate('product', 'productName category images owner')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Order.countDocuments(query);

  return res
    .status(200)
    .json(new ApiResponse(200, {
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    }, 'My orders fetched successfully'));
});

const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id)
    .populate('user', 'name email phone')
    .populate('product', 'productName category images owner');

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  if (order.user._id.toString() !== req.user._id.toString() && 
      order.product.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You can only view your own orders or orders for your products');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, 'Order fetched successfully'));
});

const returnItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;

  const order = await Order.findById(id);

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  if (order.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You can only return your own orders');
  }

  if (order.status !== 'active') {
    throw new ApiError(400, 'Order is not active');
  }

  const updateData = {
    status: 'returned',
    actualReturnDate: new Date()
  };

  if (notes) {
    updateData.notes = notes;
  }

  const updatedOrder = await Order.findByIdAndUpdate(id, updateData, { 
    new: true 
  }).populate('product', 'productName category images');

  return res
    .status(200)
    .json(new ApiResponse(200, updatedOrder, 'Item returned successfully'));
});

const cancelOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  const order = await Order.findById(id);

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  if (order.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You can only cancel your own orders');
  }

  if (order.status !== 'active') {
    throw new ApiError(400, 'Order cannot be cancelled');
  }

  const currentDate = new Date();
  const rentDate = new Date(order.rentDate);
  const timeDiff = currentDate - rentDate;
  const hoursDiff = timeDiff / (1000 * 60 * 60);

  if (hoursDiff > 24) {
    throw new ApiError(400, 'Order cannot be cancelled after 24 hours');
  }

  const updateData = {
    status: 'cancelled',
    notes: reason || 'Order cancelled by user'
  };

  const updatedOrder = await Order.findByIdAndUpdate(id, updateData, { 
    new: true 
  }).populate('product', 'productName category images');

  return res
    .status(200)
    .json(new ApiResponse(200, updatedOrder, 'Order cancelled successfully'));
});

const getOrdersForMyProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;

  const myProducts = await Product.find({ owner: req.user._id }).select('_id');
  const productIds = myProducts.map(product => product._id);

  const query = { product: { $in: productIds } };
  if (status) {
    query.status = status;
  }

  const orders = await Order.find(query)
    .populate('user', 'name email phone')
    .populate('product', 'productName category images')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Order.countDocuments(query);

  return res
    .status(200)
    .json(new ApiResponse(200, {
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    }, 'Orders for my products fetched successfully'));
});

const createCartOrder = asyncHandler(async (req, res) => {
  const {
    cartItems,
    totalPrice,
    invoiceAddress,
    deliveryAddress,
    notes
  } = req.body;

  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    throw new ApiError(400, 'Cart items are required');
  }

  if (!totalPrice || !invoiceAddress) {
    throw new ApiError(400, 'Total price and invoice address are required');
  }

  const orderId = generateOrderId();
  const rentDate = new Date();
  const deliveryDate = new Date(rentDate.getTime() + (24 * 60 * 60 * 1000));

  // Create orders for each cart item
  const orders = [];
  
  console.log('Cart order creation started. Items:', cartItems.length);
  
  for (const item of cartItems) {
    console.log('Processing cart item:', {
      productName: item.product?.productName || item.product?.name,
      rentalInfo: item.rentalInfo,
      startDate: item.startDate,
      endDate: item.endDate,
      totalPrice: item.totalPrice
    });
    
    const product = await Product.findById(item.product._id || item.product.id);
    
    if (!product || !product.isActive) {
      throw new ApiError(404, `Product ${item.product.productName} not found or not available`);
    }

    if (product.owner.toString() === req.user._id.toString()) {
      throw new ApiError(400, `You cannot rent your own product: ${product.productName}`);
    }

    // Calculate expected return date based on rental type
    let expectedReturnDate;
    let days;
    
    console.log('Raw item.rentalInfo:', item.rentalInfo);
    
    if (item.rentalInfo?.type === 'short') {
      // For hourly rentals, convert hours to fractional days (minimum 0.1 days)
      const hours = Number(item.rentalInfo.hours) || 1;
      console.log('Hours for short rental:', hours);
      days = Math.max(hours / 24, 0.1);
      expectedReturnDate = new Date(rentDate.getTime() + (hours * 60 * 60 * 1000));
    } else if (item.rentalInfo?.type === 'long' || item.rentalInfo?.type === 'daily' || !item.rentalInfo?.type) {
      // For daily rentals
      if (item.rentalInfo?.days) {
        days = Number(item.rentalInfo.days) || 1;
      } else if (item.startDate && item.endDate) {
        days = Math.ceil((new Date(item.endDate) - new Date(item.startDate)) / (24 * 60 * 60 * 1000));
      } else {
        // Fallback: default to 1 day
        days = 1;
      }
      
      // Ensure minimum days
      days = Math.max(days, 0.1);
      
      if (item.endDate) {
        expectedReturnDate = new Date(item.endDate);
      } else {
        expectedReturnDate = new Date(rentDate.getTime() + (days * 24 * 60 * 60 * 1000));
      }
    } else {
      // Unknown rental type - default to 1 day
      console.log('Unknown rental type, defaulting to 1 day');
      days = 1;
      expectedReturnDate = new Date(rentDate.getTime() + (24 * 60 * 60 * 1000));
    }

    console.log('Processing cart item - final values:', {
      productName: product.productName,
      rentalInfo: item.rentalInfo,
      calculatedDays: days,
      startDate: item.startDate,
      endDate: item.endDate,
      totalPrice: item.totalPrice,
      hours: item.rentalInfo?.hours
    });

    // Ensure days is valid before creating order
    if (!days || days <= 0) {
      console.error('Invalid days calculated:', days, 'for item:', item);
      throw new ApiError(400, `Invalid rental duration calculated for ${product.productName}`);
    }

    const orderData = {
      orderId: `${orderId}-${orders.length + 1}`, // Create sub-orders with same base ID
      user: req.user._id,
      product: product._id,
      productName: product.productName,
      category: product.category,
      productPrice: product.productPrice,
      days: days,
      hours: item.rentalInfo?.hours || null,
      rentalType: item.rentalInfo?.type === 'short' ? 'hourly' : 'daily',
      totalPrice: parseFloat(item.totalPrice),
      rentDate,
      expectedReturnDate,
      deliveryDate,
      invoiceAddress,
      deliveryAddress: deliveryAddress || invoiceAddress,
      notes,
      isCartOrder: true,
      cartOrderId: orderId
    };

    const order = await Order.create(orderData);
    orders.push(order);

    // Update product rent count
    await Product.findByIdAndUpdate(product._id, { $inc: { rentCount: 1 } });
  }

  // Populate the orders with product and user details
  const populatedOrders = await Order.find({ cartOrderId: orderId })
    .populate('user', 'name email phone')
    .populate('product', 'productName category images');

  return res
    .status(201)
    .json(new ApiResponse(201, {
      orders: populatedOrders,
      cartOrderId: orderId,
      totalItems: orders.length,
      totalAmount: totalPrice
    }, 'Cart order created successfully'));
});

export {
  createOrder,
  createCartOrder,
  getUserOrders,
  getMyOrders,
  getOrderById,
  returnItem,
  cancelOrder,
  getOrdersForMyProducts
};
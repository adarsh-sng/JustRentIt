import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Product } from '../models/product.model.js';
import { uploadOnCloudinary } from '../utils/Cloudinary.js';

const createProduct = asyncHandler(async (req, res) => {
  const { productName, description, category, hourlyPrice, dailyPrice, availability, pickup } = req.body;

  if (!productName || !description || !category || !hourlyPrice || !dailyPrice) {
    throw new ApiError(400, 'All required fields must be provided');
  }

  const productData = {
    productName,
    description,
    category,
    hourlyPrice: parseFloat(hourlyPrice),
    dailyPrice: parseFloat(dailyPrice),
    productPrice: parseFloat(dailyPrice),
    availability: availability || 'In Stock',
    pickup: pickup || 'Same day available',
    owner: req.user._id,
    ownerName: req.user.name
  };

  if (req.files && req.files.length > 0) {
    const imageUrls = [];
    for (const file of req.files) {
      const result = await uploadOnCloudinary(file.path);
      if (result) {
        imageUrls.push(result.url);
      }
    }
    productData.images = imageUrls;
  }

  const product = await Product.create(productData);

  return res
    .status(201)
    .json(new ApiResponse(201, product, 'Product listed successfully'));
});

const getAllProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, category, search, minPrice, maxPrice } = req.query;

  const query = { isActive: true };

  if (category && category !== 'All') {
    query.category = category;
  }

  if (search) {
    query.$text = { $search: search };
  }

  if (minPrice || maxPrice) {
    query.productPrice = {};
    if (minPrice) query.productPrice.$gte = parseFloat(minPrice);
    if (maxPrice) query.productPrice.$lte = parseFloat(maxPrice);
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 },
    populate: {
      path: 'owner',
      select: 'name email phone'
    }
  };

  const products = await Product.find(query)
    .populate('owner', 'name email phone')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Product.countDocuments(query);

  return res
    .status(200)
    .json(new ApiResponse(200, {
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    }, 'Products fetched successfully'));
});

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id).populate('owner', 'name email phone');

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  await Product.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });

  return res
    .status(200)
    .json(new ApiResponse(200, product, 'Product fetched successfully'));
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { productName, description, category, hourlyPrice, dailyPrice, availability, pickup } = req.body;

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  if (product.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You can only update your own products');
  }

  const updateData = {};
  if (productName) updateData.productName = productName;
  if (description) updateData.description = description;
  if (category) updateData.category = category;
  if (hourlyPrice) {
    updateData.hourlyPrice = parseFloat(hourlyPrice);
  }
  if (dailyPrice) {
    updateData.dailyPrice = parseFloat(dailyPrice);
    updateData.productPrice = parseFloat(dailyPrice);
  }
  if (availability) updateData.availability = availability;
  if (pickup) updateData.pickup = pickup;

  if (req.files && req.files.length > 0) {
    const imageUrls = [];
    for (const file of req.files) {
      const result = await uploadOnCloudinary(file.path);
      if (result) {
        imageUrls.push(result.url);
      }
    }
    updateData.images = imageUrls;
  }

  const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { 
    new: true, 
    runValidators: true 
  }).populate('owner', 'name email phone');

  return res
    .status(200)
    .json(new ApiResponse(200, updatedProduct, 'Product updated successfully'));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  if (product.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You can only delete your own products');
  }

  await Product.findByIdAndUpdate(id, { isActive: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Product deleted successfully'));
});

const getUserProducts = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const query = { owner: userId, isActive: true };

  const products = await Product.find(query)
    .populate('owner', 'name email phone')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Product.countDocuments(query);

  return res
    .status(200)
    .json(new ApiResponse(200, {
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    }, 'User products fetched successfully'));
});

const getMyProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const query = { owner: req.user._id, isActive: true };

  const products = await Product.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Product.countDocuments(query);

  return res
    .status(200)
    .json(new ApiResponse(200, {
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    }, 'My products fetched successfully'));
});

export {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getUserProducts,
  getMyProducts
};
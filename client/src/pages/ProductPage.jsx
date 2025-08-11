import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";
import { productAPI } from "../services/api";

const ProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rentalType, setRentalType] = useState('short'); // 'short' or 'long'
  const [hours, setHours] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { addToCart } = useCart();
  const { addToast } = useToast();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productAPI.getProductById(id);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">
              Loading...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">
              Product not found
            </h2>
            <Link
              to="/rental-shop"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition-colors"
            >
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const calculatePrice = () => {
    if (rentalType === 'short') {
      return product.hourlyPrice * hours;
    } else {
      if (!startDate || !endDate) return 0;
      const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
      return product.dailyPrice * days;
    }
  };

  const handleAddToCart = () => {
    if (rentalType === 'long' && (!startDate || !endDate)) {
      addToast('Please select rental dates', 'error');
      return;
    }
    
    const totalPrice = calculatePrice();
    
    if (rentalType === 'short') {
      addToCart(product, null, null, totalPrice, { type: 'short', hours });
    } else {
      const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
      addToCart(product, startDate, endDate, totalPrice, { type: 'long', days });
    }
    
    addToast('Item added to cart!');
  };

  const handleRentNow = () => {
    if (rentalType === 'long' && (!startDate || !endDate)) {
      addToast('Please select rental dates', 'error');
      return;
    }
    
    const totalPrice = calculatePrice();
    
    if (rentalType === 'short') {
      navigate('/DeliveryPage', { 
        state: { 
          product: product,
          hours: hours,
          totalPrice: totalPrice,
          type: 'short'
        }
      });
    } else {
      const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
      navigate('/DeliveryPage', { 
        state: { 
          product: product,
          days: days,
          totalPrice: totalPrice,
          startDate,
          endDate,
          type: 'long'
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link
                to="/rental-shop"
                className="hover:text-blue-600 transition-colors"
              >
                All Products
              </Link>
            </li>
            <li className="flex items-center">
              <svg
                className="w-4 h-4 mx-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700 font-medium">
                {product.productName}
              </span>
            </li>
          </ol>
        </nav>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.productName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500 text-lg">No Image Available</span>
                )}
              </div>
             
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-3xl font-semibold text-gray-900">
                    {product.productName}
                  </h1>
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                    {product.category}
                  </span>
                </div>

                <div className="flex items-baseline space-x-2 mb-6">
                  <span className="text-4xl font-bold text-blue-600">Rs {product.productPrice}</span>
                  <span className="text-lg text-gray-500">/ day</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>


              <div className="bg-gray-50 rounded-lg p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rental Type</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="short"
                        checked={rentalType === 'short'}
                        onChange={(e) => setRentalType(e.target.value)}
                        className="mr-2"
                      />
                      Short Term (Hours)
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="long"
                        checked={rentalType === 'long'}
                        onChange={(e) => setRentalType(e.target.value)}
                        className="mr-2"
                      />
                      Long Term (Days)
                    </label>
                  </div>
                </div>

                {rentalType === 'short' ? (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hours</label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setHours(Math.max(1, hours - 1))}
                        className="w-8 h-8 flex items-center justify-center border rounded"
                      >
                        -
                      </button>
                      <span className="px-3">{hours} {hours === 1 ? 'hour' : 'hours'}</span>
                      <button
                        onClick={() => setHours(hours + 1)}
                        className="w-8 h-8 flex items-center justify-center border rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 mb-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          min={startDate || new Date().toISOString().split('T')[0]}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>
                    {startDate && endDate && (
                      <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                        Duration: {Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1} days
                      </div>
                    )}
                  </div>
                )}

                <div className="text-right mb-4">
                  <span className="text-lg font-bold">Total: Rs {calculatePrice()}</span>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={rentalType === 'long' && (!startDate || !endDate)}
                    className="flex-1 border border-blue-500 text-blue-500 py-2 rounded hover:bg-blue-50 disabled:opacity-50"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleRentNow}
                    disabled={rentalType === 'long' && (!startDate || !endDate)}
                    className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    Rent Now
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">
                    Availability:
                  </span>
                  <span className="text-green-600">{product.availability}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">Pickup:</span>
                  <span className="text-gray-600">{product.pickup}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;

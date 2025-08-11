import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, days, totalPrice, invoiceAddress, permanentAddress } = location.state || {};

  const generateOrderId = () => {
    return 'ORD' + Date.now().toString(36).toUpperCase();
  };

  const orderId = generateOrderId();
  const orderDate = new Date().toLocaleDateString('en-IN');
  const deliveryDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('en-IN');

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">No order information found</h2>
          <button
            onClick={() => navigate('/rental-shop')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const deliveryAddress = permanentAddress?.address ? permanentAddress : invoiceAddress;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Success Header */}
          <div className="bg-green-500 text-white p-6 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold">Payment Successful!</h1>
            <p className="text-green-100 mt-2">Your rental order has been confirmed</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Order Details */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Order ID:</span>
                  <p className="text-gray-900">{orderId}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Order Date:</span>
                  <p className="text-gray-900">{orderDate}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Expected Delivery:</span>
                  <p className="text-gray-900">{deliveryDate}</p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Rental Item</h2>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-gray-500">IMG</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{product.productName}</h3>
                  <p className="text-sm text-gray-600">{product.category}</p>
                  <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">Rs {totalPrice}</p>
                  <p className="text-sm text-gray-600">{days} {days === 1 ? 'day' : 'days'} rental</p>
                  <p className="text-xs text-gray-500">Rs {product.productPrice}/day</p>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Rental Cost ({days} {days === 1 ? 'day' : 'days'})</span>
                  <span className="text-gray-900">Rs {totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Charges</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Security Deposit</span>
                  <span className="text-gray-500">Will be collected at delivery</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-900">Total Paid</span>
                  <span className="text-green-600">Rs {totalPrice}</span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-gray-900">{deliveryAddress.name}</p>
                <p className="text-sm text-gray-600">{deliveryAddress.phone}</p>
                <p className="text-sm text-gray-600 mt-1">{deliveryAddress.address}</p>
                <p className="text-sm text-gray-600">{deliveryAddress.city}, {deliveryAddress.pincode}</p>
              </div>
            </div>

            {/* Invoice Address */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Invoice Address</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-gray-900">{invoiceAddress.name}</p>
                <p className="text-sm text-gray-600">{invoiceAddress.email}</p>
                <p className="text-sm text-gray-600">{invoiceAddress.phone}</p>
                <p className="text-sm text-gray-600 mt-1">{invoiceAddress.address}</p>
                <p className="text-sm text-gray-600">{invoiceAddress.city}, {invoiceAddress.pincode}</p>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Important Information</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• A security deposit will be collected at the time of delivery</li>
                <li>• Please keep the product in good condition during the rental period</li>
                <li>• Return the item in the same condition to get your security deposit back</li>
                <li>• Our delivery partner will contact you 1 day before delivery</li>
                <li>• For any queries, contact our support team</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => navigate('/rental-shop')}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Print Order Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
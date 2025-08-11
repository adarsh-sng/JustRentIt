import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../contexts/CartContext";
import { orderAPI } from '../services/api';

const DeliveryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { clearCart } = useCart();
  const { product, days, totalPrice, cartItems, fromCart, hours, type } = location.state || {};
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize with user data from auth context, including address fields
  const [invoiceAddress, setInvoiceAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    city: user?.city || '',
    pincode: user?.pincode || ''
  });

  const [permanentAddress, setPermanentAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    pincode: user?.pincode || ''
  });

  const [sameAsInvoice, setSameAsInvoice] = useState(false);

  const handleInvoiceChange = (field, value) => {
    setInvoiceAddress(prev => ({ ...prev, [field]: value }));
    if (sameAsInvoice) {
      setPermanentAddress(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSameAsInvoiceChange = (checked) => {
    setSameAsInvoice(checked);
    if (checked) {
      setPermanentAddress({ ...invoiceAddress });
    }
  };

  const handlePayNow = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      // Validate required fields
      const requiredFields = ['name', 'phone', 'email', 'address', 'city', 'pincode'];
      const missingFields = requiredFields.filter(field => !invoiceAddress[field]);
      
      if (missingFields.length > 0) {
        alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
        return;
      }

      let orderResponse;

      if (fromCart) {
        // Create cart order
        const cartOrderData = {
          cartItems,
          totalPrice,
          invoiceAddress,
          deliveryAddress: sameAsInvoice ? invoiceAddress : permanentAddress,
          notes: ''
        };

        console.log('Sending cart order data:', cartOrderData);
        orderResponse = await orderAPI.createCartOrder(cartOrderData);
        console.log('Cart order created:', orderResponse);
        
        // Clear cart after successful order
        clearCart();
      } else {
        // Create single product order
        const orderData = {
          productId: product._id || product.id,
          days: days || (hours ? hours / 24 : 1),
          totalPrice,
          invoiceAddress,
          deliveryAddress: sameAsInvoice ? invoiceAddress : permanentAddress,
          notes: ''
        };

        orderResponse = await orderAPI.createOrder(orderData);
        console.log('Single order created:', orderResponse);
      }

      // Navigate to success page
      navigate('/payment-success', {
        state: {
          product,
          days,
          totalPrice,
          invoiceAddress,
          deliveryAddress: sameAsInvoice ? invoiceAddress : permanentAddress,
          cartItems,
          fromCart,
          hours,
          type,
          orderResponse
        }
      });

    } catch (error) {
      console.error('Order creation failed:', error);
      alert(`Order failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!product && !fromCart) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">No product selected</h2>
          <p className="text-gray-500 mb-6">Please select a product to continue with the rental process.</p>
          <button
            onClick={() => navigate('/rental-shop')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-blue-500 text-white p-6">
            <h1 className="text-2xl font-semibold">Review Your Order</h1>
            <p className="text-blue-100 mt-1">Please provide delivery details and complete payment</p>
          </div>

          <div className="p-6 space-y-8">
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              {fromCart ? (
                <div className="space-y-3">
                  {cartItems?.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-500">IMG</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.product.productName}</h3>
                        <p className="text-sm text-gray-600">{item.product.category}</p>
                        {item.rentalInfo?.type === 'short' ? (
                          <p className="text-sm text-gray-600">{item.rentalInfo.hours} {item.rentalInfo.hours === 1 ? 'hour' : 'hours'}</p>
                        ) : (
                          <p className="text-sm text-gray-600">{item.rentalInfo?.days} days</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">Rs {item.totalPrice}</p>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total</span>
                      <span className="font-semibold text-lg">Rs {totalPrice}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-gray-500">IMG</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{product?.productName}</h3>
                    <p className="text-sm text-gray-600">{product?.category}</p>
                    {type === 'short' ? (
                      <p className="text-sm text-gray-600">{hours} {hours === 1 ? 'hour' : 'hours'} rental</p>
                    ) : (
                      <p className="text-sm text-gray-600">{days} {days === 1 ? 'day' : 'days'} rental</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">Rs {totalPrice}</p>
                    <p className="text-sm text-gray-600">Rs {product?.productPrice}/{type === 'short' ? 'hour' : 'day'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Invoice Address */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Invoice Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={invoiceAddress.name}
                    onChange={(e) => handleInvoiceChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder={user?.name || 'Enter your full name'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={invoiceAddress.phone}
                    onChange={(e) => handleInvoiceChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder={user?.phone || 'Enter phone number'}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={invoiceAddress.email}
                    onChange={(e) => handleInvoiceChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder={user?.email || 'Enter email address'}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    value={invoiceAddress.address}
                    onChange={(e) => handleInvoiceChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Enter complete address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={invoiceAddress.city}
                    onChange={(e) => handleInvoiceChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={invoiceAddress.pincode}
                    onChange={(e) => handleInvoiceChange('pincode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter pincode"
                  />
                </div>
              </div>
            </div>

            {/* Same as Invoice Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="sameAsInvoice"
                checked={sameAsInvoice}
                onChange={(e) => handleSameAsInvoiceChange(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="sameAsInvoice" className="text-sm text-gray-700">
                Delivery address is same as invoice address
              </label>
            </div>

            {/* Permanent/Delivery Address */}
            {!sameAsInvoice && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={permanentAddress.name}
                      onChange={(e) => setPermanentAddress(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder={user?.name || 'Enter your full name'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={permanentAddress.phone}
                      onChange={(e) => setPermanentAddress(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder={user?.phone || 'Enter phone number'}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      value={permanentAddress.address}
                      onChange={(e) => setPermanentAddress(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      placeholder="Enter complete address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={permanentAddress.city}
                      onChange={(e) => setPermanentAddress(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                    <input
                      type="text"
                      value={permanentAddress.pincode}
                      onChange={(e) => setPermanentAddress(prev => ({ ...prev, pincode: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter pincode"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h2>
              <div className="space-y-3">
                {fromCart ? (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Items ({cartItems?.length})</span>
                      <span className="text-gray-900">Rs {totalPrice}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between text-sm">
                    {type === 'short' ? (
                      <>
                        <span className="text-gray-600">Rental ({hours} {hours === 1 ? 'hour' : 'hours'})</span>
                        <span className="text-gray-900">Rs {product?.productPrice} × {hours} = Rs {totalPrice}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-600">Rental ({days} {days === 1 ? 'day' : 'days'})</span>
                        <span className="text-gray-900">Rs {product?.productPrice} × {days} = Rs {totalPrice}</span>
                      </>
                    )}
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Charges</span>
                  <span className="text-green-600">Free</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-900">Total Amount</span>
                  <span className="text-blue-600">Rs {totalPrice}</span>
                </div>
              </div>

              <button
                onClick={handlePayNow}
                disabled={isProcessing}
                className={`w-full mt-6 py-3 rounded-lg font-medium transition-colors ${
                  isProcessing 
                    ? 'bg-gray-400 cursor-not-allowed text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isProcessing ? 'Processing Order...' : `Pay Now - Rs ${totalPrice}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPage;
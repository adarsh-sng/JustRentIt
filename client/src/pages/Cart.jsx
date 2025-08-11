import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, getTotalAmount } = useCart();
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    // Calculate total from cart
    const totalAmount = getTotalAmount();
    
    navigate('/DeliveryPage', {
      state: {
        cartItems: cartItems,
        totalPrice: totalAmount,
        fromCart: true
      }
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Start browsing to add items to your cart</p>
          <button
            onClick={() => navigate('/rental-shop')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
          >
            Browse Items
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Clear Cart
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <div key={item.id} className="p-6 flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Image</span>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">{item.product.productName}</h3>
                  <p className="text-gray-600">Category: {item.product.category}</p>
                  {item.rentalInfo?.type === 'short' ? (
                    <p className="text-gray-600">Duration: {item.rentalInfo.hours} {item.rentalInfo.hours === 1 ? 'hour' : 'hours'}</p>
                  ) : (
                    <p className="text-gray-600">
                      Rental Period: {formatDate(item.startDate)} - {formatDate(item.endDate)}
                    </p>
                  )}
                  <p className="text-blue-600 font-semibold">Rs {item.product.productPrice}/{item.rentalInfo?.type === 'short' ? 'hour' : 'day'}</p>
                </div>
                
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">Rs {item.totalPrice}</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 p-6 rounded-b-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-semibold text-gray-900">Total Amount:</span>
              <span className="text-2xl font-bold text-blue-600">Rs {getTotalAmount()}</span>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/rental-shop')}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-md transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={handleCheckout}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
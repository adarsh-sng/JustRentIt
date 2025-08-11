import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, startDate, endDate, totalPrice, rentalInfo) => {
    const cartItem = {
      id: `${product.id}-${Date.now()}`,
      product,
      startDate,
      endDate,
      totalPrice,
      rentalInfo,
      addedAt: new Date()
    };
    setCartItems(prev => [...prev, cartItem]);
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalAmount,
    itemCount: cartItems.length
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored authentication on app load
    const storedAuth = localStorage.getItem('justrentit_auth');
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        setUser(authData.user);
      } catch (error) {
        console.error('Error parsing stored auth:', error);
        localStorage.removeItem('justrentit_auth');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate API call - replace with actual API later
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock authentication logic
        if (email && password) {
          const userData = {
            id: 1,
            name: "Adarsh Kumar",
            email: email,
            phone: "+91 9876543210"
          };
          
          setUser(userData);
          localStorage.setItem('justrentit_auth', JSON.stringify({ user: userData, token: 'mock-token' }));
          resolve({ success: true, user: userData });
        } else {
          reject({ error: 'Invalid credentials' });
        }
      }, 1000);
    });
  };

  const register = async (userData) => {
    // Simulate API call - replace with actual API later
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (userData.name && userData.email && userData.password) {
          const newUser = {
            id: Date.now(),
            name: userData.name,
            email: userData.email,
            phone: userData.phone || ""
          };
          
          setUser(newUser);
          localStorage.setItem('justrentit_auth', JSON.stringify({ user: newUser, token: 'mock-token' }));
          resolve({ success: true, user: newUser });
        } else {
          reject({ error: 'Invalid registration data' });
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('justrentit_auth');
  };

  const updateUser = async (updatedData) => {
    // Simulate API call - replace with actual API later
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const updatedUser = { ...user, ...updatedData };
          setUser(updatedUser);
          localStorage.setItem('justrentit_auth', JSON.stringify({ user: updatedUser, token: 'mock-token' }));
          resolve({ success: true, user: updatedUser });
        } catch (error) {
          reject({ error: 'Failed to update profile' });
        }
      }, 500);
    });
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
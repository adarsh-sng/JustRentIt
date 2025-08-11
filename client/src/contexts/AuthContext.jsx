import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // First check if we have auth data in localStorage
      const storedAuth = localStorage.getItem('justrentit_auth');
      if (!storedAuth) {
        setIsLoading(false);
        return;
      }

      const response = await authAPI.getCurrentUser();
      setUser(response.data);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('justrentit_auth');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      setUser(response.data.user);
      localStorage.setItem('justrentit_auth', JSON.stringify({ 
        user: response.data.user, 
        token: response.data.accessToken 
      }));
      return { success: true, user: response.data.user };
    } catch (error) {
      throw { error: error.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      setUser(response.data.user);
      localStorage.setItem('justrentit_auth', JSON.stringify({ 
        user: response.data.user, 
        token: response.data.accessToken 
      }));
      return { success: true, user: response.data.user };
    } catch (error) {
      throw { error: error.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('justrentit_auth');
    }
  };

  const updateUser = async (updatedData) => {
    try {
      let response;
      
      if (updatedData instanceof FormData) {
        response = await authAPI.updateProfile(updatedData);
      } else {
        const formData = new FormData();
        Object.keys(updatedData).forEach(key => {
          formData.append(key, updatedData[key]);
        });
        response = await authAPI.updateProfile(formData);
      }
      
      setUser(response.data);
      localStorage.setItem('justrentit_auth', JSON.stringify({ 
        user: response.data, 
        token: localStorage.getItem('justrentit_auth') ? JSON.parse(localStorage.getItem('justrentit_auth')).token : null
      }));
      return { success: true, user: response.data };
    } catch (error) {
      throw { error: error.message || 'Failed to update profile' };
    }
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
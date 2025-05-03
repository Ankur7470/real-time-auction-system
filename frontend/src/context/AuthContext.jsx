import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/axiosConfig';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on initial render
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          // Verify token with backend
          await api.get('/auth/verify');
          setCurrentUser(JSON.parse(userData));
          setIsAuthenticated(true);
        } catch (err) {
          console.error('Token verification failed:', err);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = useCallback(async (username, password) => {
    try {
      const res = await api.post('/auth/login', { username, password });
      
      if (res.data?.token) {
        const { token, ...userData } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setCurrentUser(userData);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login failed:', err);
      toast.error(err.response?.data?.message || 'Login failed');
      return false;
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      await api.post('/auth/register', userData);
      return true;
    } catch (err) {
      console.error('Registration failed:', err);
      toast.error(err.response?.data?.message || 'Registration failed');
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setIsAuthenticated(false);
    toast.info('Logged out successfully');
  }, []);

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

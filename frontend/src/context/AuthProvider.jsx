import { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { checkAuthStatus, clearError, login as loginAction, logout as logoutAction, register as registerAction } from '../slices/authSlice';
import { connectWebSocket } from '../services/websockerService';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  // Check authentication status on mount
  useEffect(() => {
    dispatch(checkAuthStatus())
      .unwrap()
      .catch((err) => {
        // Only show error if user had a token that became invalid
        if (localStorage.getItem('token')) {
          toast.error(err.message || 'Your session has expired. Please log in again.');
        }
      });
  }, [dispatch]);

  // Connect to WebSocket when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      connectWebSocket(user.id);
    }
  }, [isAuthenticated, user]);

  // Show global errors
  useEffect(() => {
    if (error) {
      toast.error(error.message || 'An error occurred');
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Login function
  const login = async (username, password) => {
    try {
      const result = await dispatch(loginAction({ username, password })).unwrap();
      return result;
    } catch {
      // Error is handled by the slice's rejected case
      // throw err;
    }
  };

  // Register function
  const register = async (username, email, password) => {
    try {
      const result = await dispatch(registerAction({ username, email, password })).unwrap();
      toast.success('Registration successful! Please log in.');
      return result;
    } catch  {
      // Error is handled by the slice's rejected case
      // throw err;
    }
  };

  // Logout function
  const logout = () => {
    dispatch(logoutAction());
    toast.info('You have been logged out');
  };

  // Provide auth context to children components
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

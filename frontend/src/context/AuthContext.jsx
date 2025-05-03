import React, { createContext, useState, useContext, useEffect } from 'react';
// import axios from 'axios';
import api from '../services/axiosConfig';
import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  // const navigate = useNavigate();

  useEffect(() => {
    verifyToken();
  }, []);
  
  const verifyToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
  
    try {
      const res = await api.get('/auth/verify');
      if (res.data) {
        const { username, email, id, roles } = res.data;
        const userData = { username, email, id, roles };
        setCurrentUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        logout();
      }
    } catch (err) {
      console.error('Token verification failed:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };
  

  // // Auto-verify token when app loads
  // useEffect(() => {
  //   verifyToken();
  // }, []);
  
  // const verifyToken = async () => {
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //    /* const res = await axios.get('/auth/verify', {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }); */
      
  //     const res= await api.get('/auth/verify');

  //     if (res.data) {
  //     const { username, email, id, roles, token } = res.data;
  //     const userData = { username, email, id, roles };
  //       setCurrentUser(userData);
  //       setIsAuthenticated(true);
  //     } else {
  //       logout();
  //     }
  //   } catch (err) {
  //     console.error('Token verification failed:', err);
  //     logout();
  //   } finally {
  //     setLoading(false);
  //   }
  // };

   const login = async (username, password) => {
     try {
       const res = await api.post('/auth/login', { username, password });

       if (res.data && res.data.token) {
        const { username, email, id, roles, token } = res.data;
       	const userData = { username, email, id, roles };
       	localStorage.setItem('token', token);
         setCurrentUser(userData);
         localStorage.setItem('user', JSON.stringify(userData));
        
         setIsAuthenticated(true);
         return { success: true };
       } else {
         return { success: false, message: 'Invalid response' };
       }
     } catch (err) {
       return { success: false, message: err.response?.data?.message || 'Login failed' };
     }
   };
  

  
  const register = async (userData) => {
    try {
      await api.post('/auth/register', userData);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error; // Let the component handle specific error messages
    }
  };
  
   const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setIsAuthenticated(false);
    toast.info('Logged out');
    window.location.href = '/login';
  };

  const value = {
    currentUser,
    isAuthenticated,
    login,
    register,
    logout,
    loading
    
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
// context/AuthContext.js
// import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
// import api from '../services/axiosConfig';
// import { toast } from 'react-toastify';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // Load user from localStorage on initial load
//   useEffect(() => {
//     const userData = localStorage.getItem('user');
//     if (userData) {
//       setCurrentUser(JSON.parse(userData));
//       setIsAuthenticated(true);
//     }
//     verifyToken(); // Then verify with server
//   }, []);

//   const verifyToken = useCallback(async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       setLoading(false);
//       return false;
//     }

//     try {
//       const res = await api.get('/auth/verify');
//       if (res.data) {
//         const { username, email, id, roles } = res.data;
//         const userData = { username, email, id, roles };
//         setCurrentUser(userData);
//         setIsAuthenticated(true);
//         localStorage.setItem('user', JSON.stringify(userData));
//         return true;
//       }
//     } catch (err) {
//       console.error('Token verification failed:', err);
//       logout();
//     } finally {
//       setLoading(false);
//     }
//     return false;
//   }, []);

//   const login = async (username, password) => {
//     try {
//       const res = await api.post('/auth/login', { username, password });
//       if (res.data?.token) {
//         localStorage.setItem('token', res.data.token);
//         await verifyToken(); // Verify and set user data
//         return { success: true };
//       }
//       return { success: false, message: 'Invalid response' };
//     } catch (err) {
//       return { 
//         success: false, 
//         message: err.response?.data?.message || 'Login failed' 
//       };
//     }
//   };

//   const register = async (userData) => {
//     try {
//       await api.post('/auth/register', userData);
//       return { success: true };
//     } catch (error) {
//       throw error.response?.data || error;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setCurrentUser(null);
//     setIsAuthenticated(false);
//     toast.info('Logged out');
//     window.location.href = '/login';
//   };

//   const value = {
//     currentUser,
//     isAuthenticated,
//     loading,
//     login,
//     register,
//     logout,
//     verifyToken
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
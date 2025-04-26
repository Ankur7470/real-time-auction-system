import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // timeout: 10000
});

// Request interceptor for adding auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
      
//       // Add user ID from localStorage instead of store
//       const userStr = JSON.parse(localStorage.getItem('user'));
//       if (userStr) {
//         try {
//           const user = JSON.parse(userStr);
//           if (user && user.id) {
//             config.headers['X-User-ID'] = user.id;
//           }
//         } catch (e) {
//           console.error('Error parsing user from localStorage:', e);
//         }
//       }
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.id) {
      config.headers['X-User-ID'] = user.id;
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear auth data directly instead of using store
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login page
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;

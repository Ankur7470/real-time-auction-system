import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only handle 401 if there's a token (meaning user was logged in)
    const token = localStorage.getItem('token');
    if (error.response?.status === 401 && token) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

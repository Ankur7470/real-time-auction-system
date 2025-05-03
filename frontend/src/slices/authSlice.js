
// // src/store/slices/authSlice.js
// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import api from '../services/axiosConfig';
// import { disconnectWebSocket } from '../services/websockerService';
// import { 
//   LOGIN_ENDPOINT, 
//   REGISTER_ENDPOINT, 
//   CURRENT_USER_ENDPOINT 
// } from '../constants/apiEndpoints';
// // import axios from 'axios';

// // Get initial state from localStorage
// const getUserFromStorage = () => {
//   try {
//     const user = localStorage.getItem('user');
//     return user ? JSON.parse(user) : null;
//   } catch (error) {
//     console.error('Error parsing user from localStorage:', error);
//     localStorage.removeItem('user');
//     return null;
//   }
// };

// const initialState = {
//   user: getUserFromStorage(),
//   isAuthenticated: !!localStorage.getItem('token'),
//   loading: false,
//   error: null,
// };

// export const login = createAsyncThunk(
//   'auth/login',
//   async ({ username, password }, { rejectWithValue }) => {
//     try {
//       const response = await api.post(LOGIN_ENDPOINT, { username, password });
//       const { token, id, username: user, email, roles } = response.data;
      
//       // Store token and user data in localStorage
//       localStorage.setItem('token', token);
      
//       const userData = { id, username: user, email, roles };
//       localStorage.setItem('user', JSON.stringify(userData));
      
//       return { token, user: userData };
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data || { message: 'Login failed. Please check your credentials.' }
//       );
//     }
//   }
// );

// export const register = createAsyncThunk(
//   'auth/register',
//   async ({ username, email, password }, { rejectWithValue }) => {
//     try {
//       const response = await api.post(REGISTER_ENDPOINT, { username, email, password });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data || { message: 'Registration failed. Please try again.' }
//       );
//     }
//   }
// );

// export const checkAuthStatus = createAsyncThunk(
//   'auth/checkStatus',
//   async (_, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         return rejectWithValue({ message: 'No token found' });
//       }
      
//       const response = await api.get(CURRENT_USER_ENDPOINT);
      
//       return response.data.body;
//     } catch (error) {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
    
//       return rejectWithValue(
//         error.response?.data || { message: 'Authentication failed' }
//       );
//     }
//   }
// );

// export const logout = createAsyncThunk(
//   'auth/logout',
//   async () => {
//     // Disconnect WebSocket
//     disconnectWebSocket();
    
//     // Clear localStorage
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
    
//     return null;
//   }
// );

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     setCredentials: (state, { payload }) => {
//       state.user = payload;
//       state.isAuthenticated = true;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(login.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(login.fulfilled, (state, action) => {
//         state.loading = false;
//         state.isAuthenticated = true;
//         state.user = action.payload.user;
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(register.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(register.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(register.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(checkAuthStatus.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(checkAuthStatus.fulfilled, (state, action) => {
//         state.loading = false;
//         state.isAuthenticated = true;
//         state.user = action.payload;
//       })
//       .addCase(checkAuthStatus.rejected, (state) => {
//         state.loading = false;
//         state.isAuthenticated = false;
//         state.user = null;
//       })
//       .addCase(logout.fulfilled, (state) => {
//         state.isAuthenticated = false;
//         state.user = null;
//       });
//   },
// });

// export const { clearError, setCredentials } = authSlice.actions;
// export default authSlice.reducer;

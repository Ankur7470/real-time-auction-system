// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import auctionReducer from '../slices/auctionSlice';
import authReducer from '../slices/authSlice';
import biddingReducer from '../slices/biddingSlice';
import notificationReducer from '../slices/notificationSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    auctions: auctionReducer,
    bidding: biddingReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values in specific action types
        ignoredActions: [
         'auth/login/fulfilled', 
          'notifications/addNotification',
          'auth/checkStatus/fulfilled'
        ],
      },
    }),
});

export default store;

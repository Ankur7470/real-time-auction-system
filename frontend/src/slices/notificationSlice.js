
// // src/store/slices/notificationSlice.js
// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   notifications: [],
//   unreadCount: 0,
// };

// const notificationSlice = createSlice({
//   name: 'notifications',
//   initialState,
//   reducers: {
//     addNotification: (state, action) => {
//       // Add notification to the beginning of the array
//       state.notifications.unshift({
//         ...action.payload,
//         id: action.payload.id || Date.now(),
//         timestamp: action.payload.timestamp || new Date(),
//         read: false
//       });
      
//       // Limit to 20 notifications
//       if (state.notifications.length > 20) {
//         state.notifications = state.notifications.slice(0, 20);
//       }
      
//       state.unreadCount += 1;
//     },
//     markNotificationAsRead: (state, action) => {
//       const index = state.notifications.findIndex(n => n.id === action.payload);
//       if (index !== -1 && !state.notifications[index].read) {
//         state.notifications[index].read = true;
//         state.unreadCount = Math.max(0, state.unreadCount - 1);
//       }
//     },
//     markAllNotificationsAsRead: (state) => {
//       state.notifications.forEach(notification => {
//         notification.read = true;
//       });
//       state.unreadCount = 0;
//     },
//     clearNotifications: (state) => {
//       state.notifications = [];
//       state.unreadCount = 0;
//     },
//   },
// });

// export const {
//   addNotification,
//   markNotificationAsRead,
//   markAllNotificationsAsRead,
//   clearNotifications
// } = notificationSlice.actions;

// export default notificationSlice.reducer;

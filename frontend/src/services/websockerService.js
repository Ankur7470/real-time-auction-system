// // // src/services/websocketService.js
// // import SockJS from 'sockjs-client';
// // import { Client } from '@stomp/stompjs';
// // import { addNewBid } from '../slices/biddingSlice';
// // import { updateAuctionInList } from '../slices/auctionSlice';
// // import { addNotification } from '../slices/notificationSlice';

// // let stompClient = null;
// // let isConnecting = false;
// // let reconnectTimeout = null;
// // let shouldReconnect = true;
// // const RECONNECT_DELAY = 5000;

// // export const isConnected = ()=>{
// // return stompClient?.connected;
// // }

// // export const connectWebSocket = (dispatch, userId) => {
// //   if (stompClient?.connected) return stompClient;
// //   if (isConnecting) return;

// //   isConnecting = true;

// //   const socket = new SockJS('/ws-auction');
// //   stompClient = new Client({
// //     webSocketFactory: () => socket,
// //     debug: (str) => console.debug('STOMP: ' + str),
// //     reconnectDelay: 5000,
// //     heartbeatIncoming: 4000,
// //     heartbeatOutgoing: 4000,
// //   });

// //   stompClient.onConnect = () => {
// //     isConnecting = false;
// //     console.log('WebSocket connected successfully');
    
// //     // Global subscriptions here if needed
// //   };

// //   stompClient.onStompError = (frame) => {
// //     console.error('STOMP error:', frame.headers.message, frame.body);
// //   };

// //   stompClient.onWebSocketClose = () => {
// //     console.log('WebSocket disconnected');
// //   };

// //   stompClient.activate();
// //   return stompClient;
// // };

// // const handleDisconnection = (dispatch, userId) => {
// //   isConnecting = false;
// //   if (shouldReconnect) {
// //     console.log(`Attempting to reconnect in ${RECONNECT_DELAY / 1000} seconds...`);
// //     reconnectTimeout = setTimeout(() => {
// //       connectWebSocket(dispatch, userId);
// //     }, RECONNECT_DELAY);
// //   }
// // };

// // export const subscribeToAuction = (auctionId, dispatch, userId) => {
// //   if (!stompClient?.connected) {
// //     console.warn('WebSocket not connected');
// //     return null;
// //   }

// //   const auctionSub = stompClient.subscribe(
// //     `/topic/auction/${auctionId}`,
// //     (message) => dispatch(updateAuction(message.body))
// //   );

// //   const bidsSub = stompClient.subscribe(
// //     `/topic/bids/${auctionId}`,
// //     (message) => dispatch(addNewBid(message.body))
// //   );

// //   return { auctionSub, bidsSub };
// // };


// // export const disconnectWebSocket = () => {
// //   shouldReconnect = false;
// //   if (stompClient && stompClient.connected) {
// //     stompClient.deactivate().then(() => {
// //       console.log('WebSocket successfully disconnected');
// //     }).catch((error) => {
// //       console.error('Error during disconnection:', error);
// //     });
// //   }
// //   clearTimeout(reconnectTimeout);
// // };

// // export const sendBid = (auctionId, amount) => {

// //   if (!stompClient || !stompClient.connected) {
// //     console.warn('WebSocket not connected. Cannot send bid.');
// //     return false;
// //   }
  
// //   try {
// //     stompClient.publish({
// //       destination: '/app/bid',
// //       body: JSON.stringify({ auctionId, amount }),
// //       headers: { 'content-type': 'application/json' }
// //     });
// //     return true;
// //   } catch (error) {
// //     console.error('Error sending bid:', error);
// //     return false;
// //   }
// // };


// import SockJS from 'sockjs-client';
// import { Client } from '@stomp/stompjs';

// let stompClient = null;

// export const connectWebSocket = (dispatch, userId) => {
//   if (stompClient && stompClient.connected) {
//     return stompClient;
//   }

//   const socket = new SockJS('/ws-auction');
//   stompClient = new Client({
//     webSocketFactory: () => socket,
//     debug: (str) => console.debug('STOMP: ' + str),
//     reconnectDelay: 5000,
//     heartbeatIncoming: 4000,
//     heartbeatOutgoing: 4000,
//   });

//   stompClient.onConnect = () => {
//     console.log('WebSocket connected');
//   };

//   stompClient.onStompError = (frame) => {
//     console.error('STOMP error:', frame.headers.message, frame.body);
//   };

//   stompClient.activate();
//   return stompClient;
// };

// export const sendBid = (auctionId, amount, userId) => {
//   if (!stompClient || !stompClient.connected) {
//     console.error('WebSocket not connected');
//     return false;
//   }

//   try {
//     stompClient.publish({
//       destination: '/app/bid',
//       body: JSON.stringify({
//         auctionId,
//         amount,
//         userId
//       }),
//       headers: { 'content-type': 'application/json' }
//     });
//     return true;
//   } catch (error) {
//     console.error('Error sending bid:', error);
//     return false;
//   }
// };

// export const subscribeToAuction = (auctionId, callback) => {
//   if (!stompClient || !stompClient.connected) {
//     console.error('WebSocket not connected');
//     return null;
//   }

//   return stompClient.subscribe(
//     `/topic/auction/${auctionId}`,
//     callback
//   );
// };


//  export const disconnectWebSocket = () => {
//    shouldReconnect = false;
//   if (stompClient && stompClient.connected) {
//      stompClient.deactivate().then(() => {
//        console.log('WebSocket successfully disconnected');
//      }).catch((error) => {
//        console.error('Error during disconnection:', error);
//      });
//    }
//    clearTimeout(reconnectTimeout);
// };

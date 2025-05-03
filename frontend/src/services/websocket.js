// /*
// import SockJS from 'sockjs-client';
// import { Client } from '@stomp/stompjs';
// import { updateAuctionInList } from '../slices/auctionSlice';
// import { addNewBid } from '../slices/biddingSlice';
// import { addNotification } from '../slices/notificationSlice'; // <-- import your notification action

// let stompClient = null;
// let subscriptions = {};

// // Connect and initialize WebSocket client
// export function connectWebSocket(dispatch, userId) {
//   if (stompClient && stompClient.connected) return;

//   stompClient = new Client({
//     brokerURL: null, 
//     webSocketFactory: () => new SockJS('/ws-auction'),
//     reconnectDelay: 5000,
//     onConnect: (frame) => {
//       // Subscribe to user notifications if userId is present
//       if (userId) {
//         // Example: /user/{userId}/queue/notifications (Spring convention)
//         const notificationSub = stompClient.subscribe(
//           `/user/${userId}/queue/notifications`,
//           (message) => {
//             const notification = JSON.parse(message.body);
//             dispatch(addNotification(notification));
//           }
//         );
//         subscriptions['notifications'] = notificationSub;
//       }
//     },
//     onStompError: (frame) => {
//       console.error('Broker reported error: ' + frame.headers['message']);
//      // console.error('Additional details: ' + frame.body);
//     },
//   });

//   stompClient.activate();
// }


// export function subscribeToAuction(auctionId, dispatch, userId) {
//   if (!stompClient || !stompClient.connected) return {};

//   // Unsubscribe first if already subscribed
//   if (subscriptions[auctionId]) {
//     subscriptions[auctionId].auctionSubscription.unsubscribe();
//     subscriptions[auctionId].bidsSubscription.unsubscribe();
//   }

//   const auctionSubscription = stompClient.subscribe(
//     `/topic/auction/${auctionId}`,
//     (message) => {
//       const auction = JSON.parse(message.body);
//       dispatch(updateAuctionInList(auction));
//     }
//   );

  
//   // Listen for new bids
// const bidsSubscription = stompClient.subscribe(
//     `/topic/auction/${auctionId}/bids`,
//     (message) => {
//         const bid = JSON.parse(message.body);
//         // Add user data from Redux store directly
//         const currentUser = store.getState().auth.user;
//         bid.user = currentUser ? { id: currentUser.id, username: currentUser.username } : null;
//         dispatch(addNewBid(bid));
//     }
// );


//   subscriptions[auctionId] = { auctionSubscription, bidsSubscription };
//   return subscriptions[auctionId];
// }

// // Unsubscribe from all topics and disconnect
// export function disconnectWebSocket() {
//   // Unsubscribe from all auction/bid topics
//   Object.values(subscriptions).forEach((sub) => {
//     if (sub && typeof sub.unsubscribe === 'function') {
//       sub.unsubscribe();
//     } else if (sub && typeof sub === 'object') {
//       Object.values(sub).forEach((innerSub) => {
//         if (innerSub && typeof innerSub.unsubscribe === 'function') {
//           innerSub.unsubscribe();
//         }
//       });
//     }
//   });
//   subscriptions = {};

//   if (stompClient) {
//     stompClient.deactivate();
//     stompClient = null;
//   }
  
// } */

// // src/services/websocket.js
// import SockJS from 'sockjs-client';
// import { Stomp } from '@stomp/stompjs';
// // import { updateAuctionInList } from '../slices/auctionSlice';
// import { addNewBid } from '../slices/biddingSlice';
// import { addNotification } from '../slices/notificationSlice';

// let stompClient = null;
// // let subscriptions = {};

// // export function connectWebSocket(dispatch, userId) {
// //   if (stompClient && stompClient.connected) return;
// //   stompClient = new Client({
// //     brokerURL: null,
// //     webSocketFactory: () => new SockJS('/ws-auction'),
// //     reconnectDelay: 5000,
// //     onConnect: () => {},
// //     onStompError: (frame) => {
// //       console.error('Broker error:', frame.headers['message']);
// //     },
// //   });
// //   stompClient.activate();
// // }

// export function connectWebSocket(dispatch, userId) {
//   if (stompClient && stompClient.connected) return stompClient;

//   stompClient = Stomp.over(() => new SockJS('/ws-auction'));

//   stompClient.connect({}, () => {
//     // Subscribe to user notifications (if needed)
//     if (userId) {
//       stompClient.subscribe(`/user/${userId}/queue/notifications`, (msg) => {
//         dispatch(addNotification(JSON.parse(msg.body)));
//       });
//     }
//   });

//   return stompClient;
// }


// export function subscribeToAuction(auctionId, dispatch, userId) {
//   if (!stompClient || !stompClient.connected) {
//     connectWebSocket(dispatch, userId);
//   }

//   // Subscribe to real-time bid updates for this auction
//   const auctionSubscription = stompClient.subscribe(`/topic/bids/${auctionId}`, (msg) => {
//     const bid = JSON.parse(msg.body);
//     dispatch(addNewBid({ ...bid, isCurrentUser: bid.userId === userId }));
//   });

//   return { auctionSubscription };
// }
// // export function subscribeToAuction(auctionId, dispatch) {
// //   if (!stompClient || !stompClient.connected) return {};
// //   // Unsubscribe previous if any
// //   if (subscriptions[auctionId]) {
// //     subscriptions[auctionId].bidsSubscription.unsubscribe();
// //   }
// //   const bidsSubscription = stompClient.subscribe(
// //     `/topic/auction/${auctionId}/bids`,
// //     (message) => {
// //       const bid = JSON.parse(message.body);
// //       dispatch(addNewBid(bid));
// //     }
// //   );
// //   subscriptions[auctionId] = { bidsSubscription };
// //   return subscriptions[auctionId];
// // }

// // export function disconnectWebSocket() {
// //   Object.values(subscriptions).forEach((sub) => {
// //     if (sub && typeof sub.unsubscribe === 'function') {
// //       sub.unsubscribe();
// //     } else if (sub && typeof sub === 'object') {
// //       Object.values(sub).forEach((innerSub) => {
// //         if (innerSub && typeof innerSub.unsubscribe === 'function') {
// //           innerSub.unsubscribe();
// //         }
// //       });
// //     }
// //   });
// //   subscriptions = {};
// //   if (stompClient) {
// //     stompClient.deactivate();
// //     stompClient = null;
// //   }
// //}



// export function sendBid(bidDTO) {
//   if (stompClient && stompClient.connected) {
//     stompClient.send('/app/bid', {}, JSON.stringify(bidDTO));
//   }
// }

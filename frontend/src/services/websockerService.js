import SockJS from 'sockjs-client';
import { Client } from 'stompjs';
import { addNewBid } from '../slices/biddingSlice';
import { updateAuctionInList } from '../slices/auctionSlice';
import { addNotification } from '../slices/notificationSlice';

let stompClient = null;
let isConnecting = false;
let reconnectTimeout = null;

export const connectWebSocket = (dispatch, userId) => {
  if (stompClient !== null || isConnecting) {
    return stompClient;
  }
  
  isConnecting = true;
  clearTimeout(reconnectTimeout);
  
  try {
    const socket = new SockJS('/api/ws');
    stompClient = new Client({
      webSocketFactory: () => socket,
      debug: false,
      reconnectDelay: 5000,
    });

    stompClient.connect({}, () => {
      isConnecting = false;
      console.log('WebSocket connected successfully');
      
      // Subscribe to user-specific notifications
      if (userId) {
        stompClient.subscribe(`/user/${userId}/queue/notifications`, (message) => {
          try {
            const notification = JSON.parse(message.body);
            dispatch(addNotification(notification));
          } catch (error) {
            console.error('Error processing notification:', error);
          }
        });
      }

      // Subscribe to global auction updates
      stompClient.subscribe('/topic/auctions', (message) => {
        try {
          const auction = JSON.parse(message.body);
          dispatch(updateAuctionInList(auction));
        } catch (error) {
          console.error('Error processing auction update:', error);
        }
      });
    }, (error) => {
      console.error('WebSocket connection error:', error);
      isConnecting = false;
      
      // Attempt to reconnect after delay
      reconnectTimeout = setTimeout(() => {
        connectWebSocket(dispatch, userId);
      }, 5000);
    });

    return stompClient;
  } catch (error) {
    console.error('Error establishing WebSocket connection:', error);
    isConnecting = false;
    
    // Attempt to reconnect after delay
    reconnectTimeout = setTimeout(() => {
      connectWebSocket(dispatch, userId);
    }, 5000);
    
    return null;
  }
};

export const subscribeToAuction = (auctionId, dispatch, userId) => {
  if (!stompClient || !stompClient.connected) {
    console.warn('WebSocket not connected. Cannot subscribe to auction.');
    return false;
  }

  try {
    // Subscribe to auction-specific updates
    const auctionSubscription = stompClient.subscribe(`/topic/auction/${auctionId}`, (message) => {
      try {
        const auction = JSON.parse(message.body);
        dispatch(updateAuctionInList(auction));
      } catch (error) {
        console.error('Error processing auction update:', error);
      }
    });

    // Subscribe to auction bids
    const bidsSubscription = stompClient.subscribe(`/topic/bids/${auctionId}`, (message) => {
      try {
        const bid = JSON.parse(message.body);
        const currentUserId = userId;
        
        dispatch(addNewBid({
          ...bid,
          isCurrentUser: bid.userId === currentUserId
        }));
        
        // Add notification if the bid is not from the current user
        if (userId && bid.userId !== userId) {
          dispatch(addNotification({
            id: Date.now(),
            message: `New bid of $${bid.amount.toFixed(2)} on auction "${bid.auctionTitle || 'Unknown'}"`,
            timestamp: new Date(),
          }));
        }
      } catch (error) {
        console.error('Error processing bid update:', error);
      }
    });

    return { auctionSubscription, bidsSubscription };
  } catch (error) {
    console.error('Error subscribing to auction:', error);
    return false;
  }
};

export const disconnectWebSocket = () => {
  if (stompClient && stompClient.connected) {
    try {
      stompClient.disconnect();
      console.log('WebSocket disconnected');
    } catch (error) {
      console.error('Error disconnecting WebSocket:', error);
    }
    stompClient = null;
  }
  
  clearTimeout(reconnectTimeout);
  isConnecting = false;
};

export const sendBid = (auctionId, amount) => {
  if (!stompClient || !stompClient.connected) {
    console.warn('WebSocket not connected. Cannot send bid.');
    return false;
  }
  
  try {
    stompClient.send('/app/bid', {}, JSON.stringify({
      auctionId,
      amount
    }));
    return true;
  } catch (error) {
    console.error('Error sending bid:', error);
    return false;
  }
};

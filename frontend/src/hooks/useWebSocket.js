// src/hooks/useWebSocket.js
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connectWebSocket, disconnectWebSocket, subscribeToAuction, unsubscribeFromAuction } from '../services/websockerService';

export const useWebSocket = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [status, setStatus] = useState({ connected: false, connecting: false });

  useEffect(() => {
    if (isAuthenticated && user) {
      const result = connectWebSocket(dispatch, user.id);
      setStatus({
        connected: result.connected || false,
        connecting: result.connecting || false
      });
    }
    
    return () => {
      // No need to disconnect on component unmount
      // as we want to keep the connection alive throughout the app
    };
  }, [isAuthenticated, user, dispatch]);

  const connect = () => {
    if (isAuthenticated && user) {
      const result = connectWebSocket(dispatch, user.id);
      setStatus({
        connected: result.connected || false,
        connecting: result.connecting || false
      });
      return result;
    }
    return { success: false, error: 'User not authenticated' };
  };

  const disconnect = () => {
    const result = disconnectWebSocket();
    setStatus({ connected: false, connecting: false });
    return result;
  };

  const subscribeToAuctionEvents = (auctionId) => {
    if (!isAuthenticated || !user) {
      return { success: false, error: 'User not authenticated' };
    }
    
    return subscribeToAuction(auctionId, dispatch, user.id);
  };

  const unsubscribeFromAuctionEvents = (auctionId) => {
    return unsubscribeFromAuction(auctionId);
  };

  return {
    status,
    connect,
    disconnect,
    subscribeToAuctionEvents,
    unsubscribeFromAuctionEvents
  };
};

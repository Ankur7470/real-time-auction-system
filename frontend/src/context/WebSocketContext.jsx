import React, { createContext, useContext, useRef, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from './AuthContext';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const stompClient = useRef(null);

  useEffect(() => {
    if (isAuthenticated && !stompClient.current) {
      const socket = new SockJS(`/ws-auction?token=${localStorage.getItem("token")}`);
      stompClient.current = new Client({
        webSocketFactory: () => socket,
        onConnect: () => {
          console.log('WebSocket connected');
        },
        onDisconnect: () => {
          console.log('WebSocket disconnected');
        },
        onStompError: (frame) => {
          console.error('STOMP error:', frame);
        }
      });
      
      stompClient.current.activate();
    }

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
        stompClient.current = null;
      }
    };
  }, [isAuthenticated]);

  const subscribe = (destination, callback) => {
    if (stompClient.current && stompClient.current.connected) {
      return stompClient.current.subscribe(destination, callback);
    }
    return null;
  };

  const send = (destination, body, headers = {}) => {
    if (stompClient.current && stompClient.current.connected) {
      stompClient.current.publish({
        destination,
        body: JSON.stringify(body),
        headers
      });
    }
  };

  return (
    <WebSocketContext.Provider value={{ subscribe, send }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

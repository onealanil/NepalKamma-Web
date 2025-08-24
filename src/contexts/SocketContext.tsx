"use client";

/**
 * @file SocketContext.tsx
 * @description React context for Socket.IO client management
 */

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import {
  SocketContextType,
  OnlineUser,
  SocketMessage,
  SocketNotification,
  SocketType
} from '@/types/socket';
import {
  createSocket,
  disconnectSocket,
  connectSocket,
  safeEmit
} from '@/lib/socket/config';
import { useAuthStore } from '@/store/authStore';

import clientLogger from '@/utils/logger';

const SocketContext = createContext<SocketContextType | null>(null);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { user } = useAuthStore();
  const [socket, setSocket] = useState<SocketType | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Use refs to store latest values for event handlers
  const userRef = useRef(user);
  const onlineUsersRef = useRef(onlineUsers);
  
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    onlineUsersRef.current = onlineUsers;
  }, [onlineUsers]);

  // Auto-join user when connected
  const autoJoinUser = useCallback(() => {
    if (userRef.current?._id && userRef.current?.username) {
      safeEmit('addUser', { userId: userRef.current._id, username: userRef.current.username });
      clientLogger.info('User joined:', userRef.current.username);
    }
  }, []);

  // Setup socket event listeners
  const setupEventListeners = useCallback((socketInstance: SocketType) => {
    // Connection events
    socketInstance.on('connect', () => {
      setIsConnected(true);
      setConnectionError(null);
      clientLogger.info('Socket connected');
      
      // Auto-join user when connected
      autoJoinUser();
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      clientLogger.info('Socket disconnected');
    });

    socketInstance.on('connect_error', (error) => {
      setConnectionError(error.message);
      setIsConnected(false);
      clientLogger.error('Socket connection error:', error);
    });

    // Online users updates
    socketInstance.on('getU', (users: OnlineUser[]) => {
      setOnlineUsers(users);
      clientLogger.info('Online users updated:', users.length);
    });

    // Message events
    socketInstance.on('textMessageFromBack', (message: SocketMessage) => {
      clientLogger.info('Received message:', message);
      // Trigger message refresh in the app
      window.dispatchEvent(new CustomEvent('socket-message-received', { 
        detail: message 
      }));
    });

    // Notification events
    socketInstance.on('notificationFromBack', (notification: SocketNotification) => {
      clientLogger.info('Received notification:', notification);
      // Trigger notification in the app
      window.dispatchEvent(new CustomEvent('socket-notification-received', { 
        detail: notification 
      }));
    });

    socketInstance.on('notificationForLocationAndRecommend', (notification: SocketNotification) => {
      clientLogger.info('Received location/recommend notification:', notification);
      // Trigger special notification in the app
      window.dispatchEvent(new CustomEvent('socket-special-notification-received', { 
        detail: notification 
      }));
    });

    socketInstance.on('accountDeactivation', () => {
      clientLogger.warn('Account deactivated');
      // Handle account deactivation
      window.dispatchEvent(new CustomEvent('socket-account-deactivated'));
    });

    // Heartbeat
    socketInstance.on('ping', () => {
      socketInstance.emit('pong');
    });
  }, [autoJoinUser]);

  // Initialize socket when user is authenticated
  useEffect(() => {
    if (user?._id && !socket) {
      try {
        const socketInstance = createSocket();
        setSocket(socketInstance);

        // Set up event listeners
        setupEventListeners(socketInstance);

        // Connect the socket
        connectSocket();

        clientLogger.info('Socket initialized for user:', user.username);
      } catch (error) {
        clientLogger.error('Failed to initialize socket:', error);
        setConnectionError('Failed to initialize connection');
      }
    }
  }, [user?._id, user?.username, socket, setupEventListeners]);

  // Socket methods
  const sendMessage = useCallback((message: Omit<SocketMessage, 'timestamp'>) => {
    if (!socket || !isConnected) {
      clientLogger.warn('Cannot send message: Socket not connected');
      return;
    }
    
    const messageWithTimestamp: SocketMessage = {
      ...message,
      timestamp: new Date().toISOString()
    };
    
    safeEmit('textMessage', messageWithTimestamp);
    clientLogger.info('Message sent:', messageWithTimestamp);
  }, [socket, isConnected]);

  const sendNotification = useCallback((notification: Omit<SocketNotification, '_id' | 'createdAt'>) => {
    if (!socket || !isConnected) {
      clientLogger.warn('Cannot send notification: Socket not connected');
      return;
    }
    
    safeEmit('notification', notification);
    clientLogger.info('Notification sent:', notification);
  }, [socket, isConnected]);

  const markConversationAsRead = useCallback((conversationId: string, senderId: string) => {
    if (!socket || !isConnected) {
      clientLogger.warn('Cannot mark conversation as read: Socket not connected');
      return;
    }
    
    safeEmit('conversationOpened', { conversationId, senderId });
    clientLogger.info('Conversation marked as read:', conversationId);
  }, [socket, isConnected]);

  const joinUser = useCallback((userId: string, username: string) => {
    if (!socket) {
      clientLogger.warn('Cannot join user: Socket not initialized');
      return;
    }

    safeEmit('addUser', { userId, username });
    clientLogger.info('User joined:', username);
  }, [socket]);

  const leaveUser = useCallback(() => {
    if (!socket) {
      clientLogger.warn('Cannot leave user: Socket not initialized');
      return;
    }
    
    safeEmit('removeUser');
    clientLogger.info('User left');
  }, [socket]);

  const getOnlineUsersData = useCallback(() => {
    if (!socket || !isConnected) {
      clientLogger.warn('Cannot get online users: Socket not connected');
      return;
    }
    
    safeEmit('getOnlineUsers');
  }, [socket, isConnected]);

  const isUserOnline = useCallback((userId: string): boolean => {
    return onlineUsers.some(user => user.userId === userId);
  }, [onlineUsers]);

  // Cleanup on unmount or user logout
  useEffect(() => {
    return () => {
      if (socket) {
        leaveUser();
        disconnectSocket();
        setSocket(null);
        setIsConnected(false);
        setOnlineUsers([]);
        clientLogger.info('Socket cleaned up');
      }
    };
  }, [socket, leaveUser]);

  // Disconnect when user logs out
  useEffect(() => {
    if (!user && socket) {
      leaveUser();
      disconnectSocket();
      setSocket(null);
      setIsConnected(false);
      setOnlineUsers([]);
      clientLogger.info('Socket disconnected due to logout');
    }
  }, [user, socket, leaveUser]);

  const contextValue: SocketContextType = {
    socket,
    isConnected,
    onlineUsers,
    connectionError,
    sendMessage,
    sendNotification,
    markConversationAsRead,
    joinUser,
    leaveUser,
    getOnlineUsers: getOnlineUsersData,
    isUserOnline,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

/**
 * @file config.ts
 * @description Socket.IO client configuration and connection management
 */

import { io } from 'socket.io-client';
import { SocketType } from '@/types/socket';

// Socket.IO configuration
export const SOCKET_CONFIG = {
  // Use environment variable for backend URL (remove /api/v1 for socket connection)
  url: process.env.NEXT_PUBLIC_BACKEND_URL?.replace('/api/v1', '') || 'http://localhost:8000',
  options: {
    transports: ['websocket', 'polling'],
    timeout: 20000,
    forceNew: false,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    maxReconnectionAttempts: 5,
    autoConnect: false, // We'll connect manually when user is authenticated
  }
};

// Singleton socket instance
let socketInstance: SocketType | null = null;

/**
 * Creates and returns a Socket.IO client instance
 * @returns Socket instance
 */
export const createSocket = (): SocketType => {
  if (!socketInstance) {
    socketInstance = io(SOCKET_CONFIG.url, SOCKET_CONFIG.options);
    
    // Add global error handling
    socketInstance.on('connect_error', (error: Error) => {
      console.error('Socket connection error:', error);
    });

    socketInstance.on('disconnect', (reason: string) => {
      console.log('Socket disconnected:', reason);
    });

    socketInstance.io.on('reconnect', (attemptNumber: number) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
    });

    socketInstance.io.on('reconnect_error', (error: Error) => {
      console.error('Socket reconnection error:', error);
    });

    socketInstance.io.on('reconnect_failed', () => {
      console.error('Socket reconnection failed');
    });
  }

  return socketInstance;
};

/**
 * Gets the existing socket instance
 * @returns Socket instance or null
 */
export const getSocket = (): SocketType | null => {
  return socketInstance;
};

/**
 * Disconnects and cleans up the socket instance
 */
export const disconnectSocket = (): void => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

/**
 * Checks if socket is connected
 * @returns boolean indicating connection status
 */
export const isSocketConnected = (): boolean => {
  return socketInstance?.connected || false;
};

/**
 * Connects the socket if not already connected
 */
export const connectSocket = (): void => {
  if (socketInstance && !socketInstance.connected) {
    socketInstance.connect();
  }
};

/**
 * Utility function to safely emit events with error handling
 * @param eventName - Name of the event to emit
 * @param data - Data to send with the event
 */
export const safeEmit = (eventName: string, data?: unknown): void => {
  if (socketInstance && socketInstance.connected) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (socketInstance.emit as any)(eventName, data);
    } catch (error) {
      console.error(`Error emitting ${eventName}:`, error);
    }
  } else {
    console.warn(`Cannot emit ${eventName}: Socket not connected`);
  }
};

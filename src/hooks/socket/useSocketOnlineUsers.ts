"use client";

/**
 * @file useSocketOnlineUsers.ts
 * @description Hook for managing online users via Socket.IO
 */

import { useEffect, useCallback } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { OnlineUser } from '@/types/socket';
import clientLogger from '@/utils/logger';

interface UseSocketOnlineUsersProps {
  onOnlineUsersUpdate?: (users: OnlineUser[]) => void;
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
}

export const useSocketOnlineUsers = ({
  onOnlineUsersUpdate,
  autoRefresh = false,
  refreshInterval = 30000 // 30 seconds
}: UseSocketOnlineUsersProps = {}) => {
  const { onlineUsers, getOnlineUsers, isConnected, isUserOnline } = useSocket();

  // Call custom handler when online users update
  useEffect(() => {
    if (onOnlineUsersUpdate) {
      onOnlineUsersUpdate(onlineUsers);
    }
  }, [onlineUsers, onOnlineUsersUpdate]);

  // Auto-refresh online users if enabled
  useEffect(() => {
    if (!autoRefresh || !isConnected) return;

    const interval = setInterval(() => {
      getOnlineUsers();
      clientLogger.info('Auto-refreshing online users');
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, isConnected, refreshInterval, getOnlineUsers]);

  // Refresh online users manually
  const refreshOnlineUsers = useCallback(() => {
    if (isConnected) {
      getOnlineUsers();
      clientLogger.info('Manually refreshing online users');
    } else {
      clientLogger.warn('Cannot refresh online users: Socket not connected');
    }
  }, [isConnected, getOnlineUsers]);

  // Get online status of specific user
  const getUserOnlineStatus = useCallback((userId: string): boolean => {
    return isUserOnline(userId);
  }, [isUserOnline]);

  // Get online users count
  const getOnlineUsersCount = useCallback((): number => {
    return onlineUsers.length;
  }, [onlineUsers.length]);

  // Get online users list (filtered by specific criteria if needed)
  const getFilteredOnlineUsers = useCallback((
    filterFn?: (user: OnlineUser) => boolean
  ): OnlineUser[] => {
    if (filterFn) {
      return onlineUsers.filter(filterFn);
    }
    return onlineUsers;
  }, [onlineUsers]);

  // Check if any users from a list are online
  const areAnyUsersOnline = useCallback((userIds: string[]): boolean => {
    return userIds.some(userId => isUserOnline(userId));
  }, [isUserOnline]);

  // Get online users from a specific list
  const getOnlineUsersFromList = useCallback((userIds: string[]): OnlineUser[] => {
    return onlineUsers.filter(user => userIds.includes(user.userId));
  }, [onlineUsers]);

  return {
    onlineUsers,
    isConnected,
    refreshOnlineUsers,
    getUserOnlineStatus,
    getOnlineUsersCount,
    getFilteredOnlineUsers,
    areAnyUsersOnline,
    getOnlineUsersFromList,
  };
};

/**
 * Hook specifically for conversation participants online status
 */
export const useConversationOnlineStatus = (participantIds: string[]) => {
  const { isUserOnline, onlineUsers } = useSocket();

  // Get online status for all participants
  const getParticipantsOnlineStatus = useCallback(() => {
    return participantIds.map(userId => ({
      userId,
      isOnline: isUserOnline(userId)
    }));
  }, [participantIds, isUserOnline]);

  // Check if any participant is online
  const isAnyParticipantOnline = useCallback(() => {
    return participantIds.some(userId => isUserOnline(userId));
  }, [participantIds, isUserOnline]);

  // Get count of online participants
  const getOnlineParticipantsCount = useCallback(() => {
    return participantIds.filter(userId => isUserOnline(userId)).length;
  }, [participantIds, isUserOnline]);

  return {
    getParticipantsOnlineStatus,
    isAnyParticipantOnline,
    getOnlineParticipantsCount,
    onlineUsers,
  };
};

/**
 * Hook for displaying online status indicators
 */
export const useOnlineStatusIndicator = (userId: string) => {
  const { isUserOnline } = useSocket();

  const isOnline = isUserOnline(userId);

  // Get appropriate CSS classes for online status
  const getStatusClasses = useCallback((
    onlineClass: string = 'bg-green-500',
    offlineClass: string = 'bg-gray-400'
  ) => {
    return isOnline ? onlineClass : offlineClass;
  }, [isOnline]);

  // Get status text
  const getStatusText = useCallback((
    onlineText: string = 'Online',
    offlineText: string = 'Offline'
  ) => {
    return isOnline ? onlineText : offlineText;
  }, [isOnline]);

  return {
    isOnline,
    getStatusClasses,
    getStatusText,
  };
};

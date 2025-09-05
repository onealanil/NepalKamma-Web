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
  refreshInterval?: number; 
}

export const useSocketOnlineUsers = ({
  onOnlineUsersUpdate,
  autoRefresh = false,
  refreshInterval = 30000 // 30 seconds
}: UseSocketOnlineUsersProps = {}) => {
  const { onlineUsers, getOnlineUsers, isConnected, isUserOnline } = useSocket();

  useEffect(() => {
    if (onOnlineUsersUpdate) {
      onOnlineUsersUpdate(onlineUsers);
    }
  }, [onlineUsers, onOnlineUsersUpdate]);

  useEffect(() => {
    if (!autoRefresh || !isConnected) return;

    const interval = setInterval(() => {
      getOnlineUsers();
      clientLogger.info('Auto-refreshing online users');
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, isConnected, refreshInterval, getOnlineUsers]);

  const refreshOnlineUsers = useCallback(() => {
    if (isConnected) {
      getOnlineUsers();
      clientLogger.info('Manually refreshing online users');
    } else {
      clientLogger.warn('Cannot refresh online users: Socket not connected');
    }
  }, [isConnected, getOnlineUsers]);

  const getUserOnlineStatus = useCallback((userId: string): boolean => {
    return isUserOnline(userId);
  }, [isUserOnline]);

  const getOnlineUsersCount = useCallback((): number => {
    return onlineUsers.length;
  }, [onlineUsers.length]);

  const getFilteredOnlineUsers = useCallback((
    filterFn?: (user: OnlineUser) => boolean
  ): OnlineUser[] => {
    if (filterFn) {
      return onlineUsers.filter(filterFn);
    }
    return onlineUsers;
  }, [onlineUsers]);

  const areAnyUsersOnline = useCallback((userIds: string[]): boolean => {
    return userIds.some(userId => isUserOnline(userId));
  }, [isUserOnline]);

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

  const getParticipantsOnlineStatus = useCallback(() => {
    return participantIds.map(userId => ({
      userId,
      isOnline: isUserOnline(userId)
    }));
  }, [participantIds, isUserOnline]);

  const isAnyParticipantOnline = useCallback(() => {
    return participantIds.some(userId => isUserOnline(userId));
  }, [participantIds, isUserOnline]);

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

  const getStatusClasses = useCallback((
    onlineClass: string = 'bg-green-500',
    offlineClass: string = 'bg-gray-400'
  ) => {
    return isOnline ? onlineClass : offlineClass;
  }, [isOnline]);

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

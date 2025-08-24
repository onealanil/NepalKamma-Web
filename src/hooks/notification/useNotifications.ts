/**
 * @file useNotifications.ts
 * @description Custom hooks for notification management
 */

import { useState, useEffect, useCallback } from 'react';
import useSWR from 'swr';
import {
  NotificationI,
  NotificationFilters,
  NotificationType
} from '@/types/notification';
import { SocketNotification } from '@/types/socket';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadNotificationCount,
  clearReadNotifications
} from '@/lib/notification/notification-api';
import { useSocketNotifications } from '@/hooks/socket/useSocketNotifications';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-toastify';
import clientLogger from '@/utils/logger';

interface UseNotificationsReturn {
  notifications: NotificationI[];
  isLoading: boolean;
  isError: boolean;
  totalCount: number;
  unreadCount: number;
  hasMore: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotif: (notificationId: string) => Promise<void>;
  clearRead: () => Promise<void>;
  loadMore: () => void;
  refresh: () => void;
}

export const useNotifications = (filters: NotificationFilters = {}): UseNotificationsReturn => {
  const { user } = useAuthStore();
  const [page, setPage] = useState(1);
  const [allNotifications, setAllNotifications] = useState<NotificationI[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { data, error, isLoading, mutate } = useSWR(
    user?._id ? ['notifications', { ...filters, page }, user._id] : null,
    () => user?._id ? getNotifications({ ...filters, page, limit: 20 }, user._id) : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  // Handle real-time notifications
  useSocketNotifications({
    onNotificationReceived: (notification: SocketNotification) => {
      // Add new notification to the top of the list
      const newNotification: NotificationI = {
        _id: notification._id,
        senderId: notification.sender,
        recipientId: notification.receiver,
        notification: notification.message,
        type: notification.type as NotificationType,
        isRead: notification.isRead,
        jobId: null, // Will be populated from server
        gigId: null, // Will be populated from server
        createdAt: notification.createdAt,
        updatedAt: notification.createdAt,
      };

      setAllNotifications(prev => [newNotification, ...prev]);

      // Show toast notification
      toast.success(notification.message);

      // Refresh to get the actual notification from server
      setTimeout(() => {
        mutate();
      }, 1000);

      clientLogger.info('Real-time notification received:', notification);
    }
  });

  // Update notifications when data changes
  useEffect(() => {
    if (data?.data?.notifications) {
      if (page === 1) {
        setAllNotifications(data.data.notifications);
      } else {
        setAllNotifications(prev => [...prev, ...data.data.notifications]);
      }
      setHasMore(data.data.hasMore);
    }
  }, [data, page]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      // Note: Your backend only supports bulk read, so this will mark all as read
      await markNotificationAsRead();
      
      // Update local state
      setAllNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      );
      
      // Revalidate to update counts
      mutate();
      
      clientLogger.info('Notification marked as read:', notificationId);
    } catch (error) {
      toast.error('Failed to mark notification as read');
      clientLogger.error('Error marking notification as read:', error);
    }
  }, [mutate]);

  const markAllAsRead = useCallback(async () => {
    try {
      await markAllNotificationsAsRead();
      
      // Update local state
      setAllNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      
      // Revalidate
      mutate();
      
      toast.success('All notifications marked as read');
      clientLogger.info('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all notifications as read');
      clientLogger.error('Error marking all notifications as read:', error);
    }
  }, [mutate]);

  const deleteNotif = useCallback(async (notificationId: string) => {
    try {
      // Note: Your backend doesn't have delete endpoint, this will mark all as read
      await deleteNotification();
      
      // Update local state
      setAllNotifications(prev => 
        prev.filter(notif => notif._id !== notificationId)
      );
      
      // Revalidate
      mutate();
      
      toast.success('Notification deleted');
      clientLogger.info('Notification deleted:', notificationId);
    } catch (error) {
      toast.error('Failed to delete notification');
      clientLogger.error('Error deleting notification:', error);
    }
  }, [mutate]);

  const clearRead = useCallback(async () => {
    try {
      await clearReadNotifications();
      
      // Update local state
      setAllNotifications(prev => 
        prev.filter(notif => !notif.isRead)
      );
      
      // Revalidate
      mutate();
      
      toast.success('Read notifications cleared');
      clientLogger.info('Read notifications cleared');
    } catch (error) {
      toast.error('Failed to clear read notifications');
      clientLogger.error('Error clearing read notifications:', error);
    }
  }, [mutate]);

  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, isLoading]);

  const refresh = useCallback(() => {
    setPage(1);
    setAllNotifications([]);
    mutate();
  }, [mutate]);

  return {
    notifications: allNotifications,
    isLoading,
    isError: !!error,
    totalCount: data?.data?.totalCount || 0,
    unreadCount: data?.data?.unreadCount || 0,
    hasMore,
    markAsRead,
    markAllAsRead,
    deleteNotif,
    clearRead,
    loadMore,
    refresh,
  };
};

/**
 * Hook for notification statistics using your existing unread count endpoint
 */
export const useNotificationStats = () => {
  const { data, error, isLoading, mutate } = useSWR(
    'notification-unread-count',
    getUnreadNotificationCount,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );

  return {
    unreadCount: data || 0,
    isLoading,
    isError: !!error,
    refresh: mutate,
  };
};

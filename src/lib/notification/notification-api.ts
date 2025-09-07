/**
 * @file notification-api.ts
 * @description API functions for notification management matching backend routes
 */

import axiosInstance from '@/lib/axios';
import { NotificationResponse, NotificationFilters } from '@/types/notification';

/**
 * Fetch user notifications by receiver ID
 */
export const getNotifications = async (filters: NotificationFilters = {}, userId: string): Promise<NotificationResponse> => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const response = await axiosInstance.get(`/notification/getNotificationByReceiver/${userId}`);
    const notifications = response.data?.data || response.data || [];

    let filteredNotifications = notifications;

    if (filters.type) {
      filteredNotifications = filteredNotifications.filter((notif: Record<string, unknown>) => notif.type === filters.type);
    }

    if (filters.isRead !== undefined) {
      filteredNotifications = filteredNotifications.filter((notif: Record<string, unknown>) => notif.isRead === filters.isRead);
    }

    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);
    const hasMore = endIndex < filteredNotifications.length;

    return {
      success: true,
      data: {
        notifications: paginatedNotifications,
        totalCount: filteredNotifications.length,
        unreadCount: filteredNotifications.filter((notif: Record<string, unknown>) => !notif.isRead).length,
        hasMore: hasMore
      }
    };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

/**
 */
export const markNotificationAsRead = async (): Promise<void> => {
  try {
    await axiosInstance.put('/notification/readAllNotifications');
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

/**
 * Mark all notifications as read using your existing endpoint
 */
export const markAllNotificationsAsRead = async (): Promise<void> => {
  try {
    await axiosInstance.put('/notification/readAllNotifications');
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

/**
 * Delete notification 
 */
export const deleteNotification = async (): Promise<void> => {
  try {
    await axiosInstance.put('/notification/readAllNotifications');
    console.warn('Delete notification not implemented in backend, marking as read instead');
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

/**
 * Get unread notification count using your existing endpoint
 */
export const getUnreadNotificationCount = async (): Promise<number> => {
  try {
    const response = await axiosInstance.get('/notification/unreadNotification');
    return response.data?.data?.count || response.data?.count || 0;
  } catch (error) {
    console.error('Error fetching unread notification count:', error);
    return 0;
  }
};

/**
 * Clear all read notifications 
 */
export const clearReadNotifications = async (): Promise<void> => {
  try {
    // mark all as read
    await axiosInstance.put('/notification/readAllNotifications');
  } catch (error) {
    console.error('Error clearing read notifications:', error);
    throw error;
  }
};

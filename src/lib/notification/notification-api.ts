/**
 * @file notification-api.ts
 * @description API functions for notification management matching backend routes
 */

import axiosInstance from '@/lib/axios';
import { NotificationResponse, NotificationFilters } from '@/types/notification';

/**
 * Fetch user notifications by receiver ID
 * Since your backend route expects /:id but uses protect middleware,
 * we'll need to pass the user ID from the frontend
 */
export const getNotifications = async (filters: NotificationFilters = {}, userId: string): Promise<NotificationResponse> => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const response = await axiosInstance.get(`/notification/getNotificationByReceiver/${userId}`);

    // Transform backend response to match frontend expectations
    const notifications = response.data?.data || response.data || [];

    // Apply client-side filtering if needed
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
 * Mark notification as read (individual notification)
 * Note: Your backend doesn't have individual mark as read, so we'll use the bulk endpoint
 */
export const markNotificationAsRead = async (): Promise<void> => {
  try {
    // Since your backend only has bulk read, we'll call the bulk endpoint
    // You might want to add individual read endpoint to your backend
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
 * Delete notification (not available in your backend)
 * This is a placeholder - you might want to add this endpoint to your backend
 */
export const deleteNotification = async (): Promise<void> => {
  try {
    // Your backend doesn't have delete endpoint
    // For now, we'll just mark all as read
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
 * Clear all read notifications (not available in your backend)
 * This is a placeholder - you might want to add this endpoint to your backend
 */
export const clearReadNotifications = async (): Promise<void> => {
  try {
    // Your backend doesn't have clear read endpoint
    // For now, we'll just mark all as read
    await axiosInstance.put('/notification/readAllNotifications');
    console.warn('Clear read notifications not implemented in backend, marking all as read instead');
  } catch (error) {
    console.error('Error clearing read notifications:', error);
    throw error;
  }
};

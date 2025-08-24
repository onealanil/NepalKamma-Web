"use client";

/**
 * @file useSocketNotifications.ts
 * @description Hook for handling real-time notifications via Socket.IO
 */

import { useEffect, useCallback } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { SocketNotification } from '@/types/socket';
import { useAuthStore } from '@/store/authStore';
import { mutate } from 'swr';
import { SuccessToast, ErrorToast, InfoToast } from '@/components/ui/Toast';
import clientLogger from '@/utils/logger';

interface UseSocketNotificationsProps {
  onNotificationReceived?: (notification: SocketNotification) => void;
  onSpecialNotificationReceived?: (notification: SocketNotification) => void;
  onAccountDeactivated?: () => void;
  showToasts?: boolean;
}

export const useSocketNotifications = ({
  onNotificationReceived,
  onSpecialNotificationReceived,
  onAccountDeactivated,
  showToasts = true
}: UseSocketNotificationsProps = {}) => {
  const { sendNotification, isConnected } = useSocket();
  const { user } = useAuthStore();

  // Handle regular notifications
  useEffect(() => {
    const handleNotificationReceived = (event: CustomEvent<SocketNotification>) => {
      const notification = event.detail;
      
      clientLogger.info('Received notification:', notification);
      
      // Revalidate notifications data
      mutate('/api/notifications');
      
      // Show toast notification if enabled
      if (showToasts) {
        const message = notification.message || 'You have a new notification';
        
        switch (notification.type) {
          case 'success':
            SuccessToast(message);
            break;
          case 'error':
            ErrorToast(message);
            break;
          case 'info':
          default:
            InfoToast(message);
            break;
        }
      }
      
      // Call custom handler if provided
      if (onNotificationReceived) {
        onNotificationReceived(notification);
      }
    };

    window.addEventListener('socket-notification-received', handleNotificationReceived as EventListener);

    return () => {
      window.removeEventListener('socket-notification-received', handleNotificationReceived as EventListener);
    };
  }, [onNotificationReceived, showToasts]);

  // Handle special notifications (location/recommend)
  useEffect(() => {
    const handleSpecialNotificationReceived = (event: CustomEvent<SocketNotification>) => {
      const notification = event.detail;
      
      clientLogger.info('Received special notification:', notification);
      
      // Revalidate relevant data based on notification type
      if (notification.type === 'location') {
        mutate('/api/location');
      } else if (notification.type === 'recommendation') {
        mutate('/api/recommendations');
      }
      
      // Show toast notification if enabled
      if (showToasts) {
        InfoToast(notification.message || 'You have a new update');
      }
      
      // Call custom handler if provided
      if (onSpecialNotificationReceived) {
        onSpecialNotificationReceived(notification);
      }
    };

    window.addEventListener('socket-special-notification-received', handleSpecialNotificationReceived as EventListener);

    return () => {
      window.removeEventListener('socket-special-notification-received', handleSpecialNotificationReceived as EventListener);
    };
  }, [onSpecialNotificationReceived, showToasts]);

  // Handle account deactivation
  useEffect(() => {
    const handleAccountDeactivated = () => {
      clientLogger.warn('Account has been deactivated');
      
      // Show error toast
      if (showToasts) {
        ErrorToast('Your account has been deactivated. Please contact support.');
      }
      
      // Call custom handler if provided
      if (onAccountDeactivated) {
        onAccountDeactivated();
      } else {
        // Default behavior: redirect to login or show modal
        window.location.href = '/auth/signin?reason=deactivated';
      }
    };

    window.addEventListener('socket-account-deactivated', handleAccountDeactivated);

    return () => {
      window.removeEventListener('socket-account-deactivated', handleAccountDeactivated);
    };
  }, [onAccountDeactivated, showToasts]);

  // Send notification function
  const sendSocketNotification = useCallback((
    receiverId: string,
    type: string,
    message: string,
    isRead: boolean = false
  ) => {
    if (!user?._id || !isConnected) {
      clientLogger.warn('Cannot send notification: User not authenticated or socket not connected');
      return false;
    }

    const notification: Omit<SocketNotification, '_id' | 'createdAt'> = {
      receiver: receiverId,
      sender: user._id,
      type,
      message,
      isRead,
    };

    try {
      sendNotification(notification);
      clientLogger.info('Socket notification sent successfully');
      return true;
    } catch (error) {
      clientLogger.error('Failed to send socket notification:', error);
      return false;
    }
  }, [user?._id, isConnected, sendNotification]);

  return {
    sendSocketNotification,
    isConnected,
  };
};

/**
 * Hook for managing notification badges and counts
 */
export const useSocketNotificationBadge = () => {
  const { isConnected } = useSocket();

  useEffect(() => {
    const handleNotificationReceived = () => {
      // Revalidate unread count when notifications are received
      mutate('/api/notifications/unread-count');
    };

    window.addEventListener('socket-notification-received', handleNotificationReceived);
    window.addEventListener('socket-special-notification-received', handleNotificationReceived);

    return () => {
      window.removeEventListener('socket-notification-received', handleNotificationReceived);
      window.removeEventListener('socket-special-notification-received', handleNotificationReceived);
    };
  }, []);

  return {
    isConnected,
  };
};

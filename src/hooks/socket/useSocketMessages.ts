"use client";

/**
 * @file useSocketMessages.ts
 * @description Hook for handling real-time messages via Socket.IO
 */

import { useEffect, useCallback, useRef } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { SocketMessage } from '@/types/socket';
import { useAuthStore } from '@/store/authStore';
import { mutate } from 'swr';
import clientLogger from '@/utils/logger';

interface UseSocketMessagesProps {
  conversationId?: string;
  onMessageReceived?: (message: SocketMessage) => void;
  onMessageSent?: (message: SocketMessage) => void;
}

export const useSocketMessages = ({
  conversationId,
  onMessageReceived,
  onMessageSent
}: UseSocketMessagesProps = {}) => {
  const { sendMessage, isConnected, markConversationAsRead } = useSocket();
  const { user } = useAuthStore();
  const conversationIdRef = useRef(conversationId);

  // Update ref when conversationId changes
  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  // Handle incoming messages
  useEffect(() => {
    const handleMessageReceived = (event: CustomEvent<SocketMessage>) => {
      const message = event.detail;
      
      if (!conversationIdRef.current || message.conversationId === conversationIdRef.current) {
        clientLogger.info('Processing received message:', message);
        
        if (message.conversationId) {
          mutate(`/api/message/${message.conversationId}`);
        }
        
        mutate('/api/conversation');
        
        if (onMessageReceived) {
          onMessageReceived(message);
        }
        
        // Auto-mark as read if conversation is open and user is not the sender
        if (conversationIdRef.current === message.conversationId && 
            user?._id && 
            message.sender !== user._id) {
          markConversationAsRead(message.conversationId, user._id);
        }
      }
    };

    // Listen for socket message events
    window.addEventListener('socket-message-received', handleMessageReceived as EventListener);

    return () => {
      window.removeEventListener('socket-message-received', handleMessageReceived as EventListener);
    };
  }, [onMessageReceived, markConversationAsRead, user?._id]);

  // Send message function
  const sendSocketMessage = useCallback((
    recipientId: string,
    messageText: string,
    targetConversationId?: string
  ) => {
    if (!user?._id || !isConnected) {
      clientLogger.warn('Cannot send message: User not authenticated or socket not connected');
      return false;
    }

    const conversationIdToUse = targetConversationId || conversationId;
    if (!conversationIdToUse) {
      clientLogger.warn('Cannot send message: No conversation ID provided');
      return false;
    }

    const message: Omit<SocketMessage, 'timestamp'> = {
      sender: user._id,
      receiver: recipientId,
      message: messageText,
      conversationId: conversationIdToUse,
    };

    try {
      sendMessage(message);
      
      // Call custom handler if provided
      if (onMessageSent) {
        onMessageSent({ ...message, timestamp: new Date().toISOString() });
      }
      
      clientLogger.info('Socket message sent successfully');
      return true;
    } catch (error) {
      clientLogger.error('Failed to send socket message:', error);
      return false;
    }
  }, [user?._id, isConnected, conversationId, sendMessage, onMessageSent]);

  // Mark conversation as read
  const markAsRead = useCallback((targetConversationId?: string) => {
    if (!user?._id) {
      clientLogger.warn('Cannot mark as read: User not authenticated');
      return;
    }

    const conversationIdToUse = targetConversationId || conversationId;
    if (!conversationIdToUse) {
      clientLogger.warn('Cannot mark as read: No conversation ID provided');
      return;
    }

    markConversationAsRead(conversationIdToUse, user._id);
  }, [user?._id, conversationId, markConversationAsRead]);

  return {
    sendSocketMessage,
    markAsRead,
    isConnected,
  };
};

/**
 * Hook specifically for conversation list updates with real-time last message
 */
export const useSocketConversations = (
  onLastMessageUpdate?: (conversationId: string, message: SocketMessage) => void
) => {
  const { isConnected } = useSocket();

  useEffect(() => {
    const handleMessageReceived = (event: CustomEvent<SocketMessage>) => {
      const message = event.detail;

      // Revalidate conversations list when any message is received
      mutate('/api/conversation');

      // Update last message in real-time if callback provided
      if (onLastMessageUpdate && message.conversationId) {
        onLastMessageUpdate(message.conversationId, message);
      }

      clientLogger.info('Conversation list updated for message:', message.conversationId);
    };

    const handleNotificationReceived = () => {
      // Revalidate conversations list when notifications are received
      mutate('/api/conversation');
    };

    window.addEventListener('socket-message-received', handleMessageReceived as EventListener);
    window.addEventListener('socket-notification-received', handleNotificationReceived);

    return () => {
      window.removeEventListener('socket-message-received', handleMessageReceived as EventListener);
      window.removeEventListener('socket-notification-received', handleNotificationReceived);
    };
  }, [onLastMessageUpdate]);

  return {
    isConnected,
  };
};

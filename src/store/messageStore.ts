import { create } from 'zustand';
import { 
  createConversation, 
  createMessage, 
  markMessagesAsRead 
} from '@/lib/message/message-api';
import {
  CreateConversationData,
  CreateMessageData,
  ConversationI,
  MessageI
} from '@/types/message';
import clientLogger from '@/utils/logger';

interface MessageState {
  // State
  isLoading: boolean;
  error: string | null;
  currentConversation: ConversationI | null;
  
  // Actions
  createConversationAction: (data: CreateConversationData) => Promise<ConversationI | null>;
  createMessageAction: (data: CreateMessageData) => Promise<MessageI | null>;
  markAsReadAction: (conversationId: string) => Promise<boolean>;
  setCurrentConversation: (conversation: ConversationI | null) => void;
  clearError: () => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  // Initial state
  isLoading: false,
  error: null,
  currentConversation: null,

  // Create conversation action
  createConversationAction: async (data: CreateConversationData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await createConversation(data);
      
      if (response.success && response.data) {
        set({ isLoading: false });
        return response.data.conversation;
      } else {
        set({ 
          isLoading: false, 
          error: response.error || 'Failed to create conversation' 
        });
        return null;
      }
    } catch (error) {
      const errorMessage = 'Failed to create conversation. Please try again.';
      set({ isLoading: false, error: errorMessage });
      clientLogger.error('Create conversation error:', error);
      return null;
    }
  },

  // Create message action
  createMessageAction: async (data: CreateMessageData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await createMessage(data);
      
      if (response.success && response.data) {
        set({ isLoading: false });
        return response.data.messages;
      } else {
        set({ 
          isLoading: false, 
          error: response.error || 'Failed to send message' 
        });
        return null;
      }
    } catch (error) {
      const errorMessage = 'Failed to send message. Please try again.';
      set({ isLoading: false, error: errorMessage });
      clientLogger.error('Create message error:', error);
      return null;
    }
  },

  // Mark messages as read action
  markAsReadAction: async (conversationId: string) => {
    try {
      const response = await markMessagesAsRead(conversationId);
      return response.success;
    } catch (error) {
      clientLogger.error('Mark as read error:', error);
      return false;
    }
  },

  // Set current conversation
  setCurrentConversation: (conversation: ConversationI | null) => {
    set({ currentConversation: conversation });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));

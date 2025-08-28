import { ApiResponse } from "@/types/job-provider/job-api";
import axiosInstance from "../axios";
import {
  CreateConversationData,
  CreateMessageData,
  ConversationResponse,
  ConversationsResponse,
  MessagesResponse,
  MessageResponse,
  LastMessageResponse,
  UnreadCountResponse
} from "@/types/message";
import { handleApiError } from "../job/job-api";

/**
 * @function createConversation
 * @description Creates a new conversation between two users
 * @param conversationData - Conversation data with senderId and receiverId
 * @returns Promise<ApiResponse<ConversationResponse>> - Response from the server
 * @route POST /message/conversation
 */
export async function createConversation(
  conversationData: CreateConversationData
): Promise<ApiResponse<ConversationResponse>> {
  try {
    if (!conversationData.senderId || !conversationData.receiverId) {
      throw new Error("Both senderId and receiverId are required");
    }

    const response = await axiosInstance.post(`/message/conversation`, conversationData);
    return {
      success: true,
      data: response.data,
      message: "Conversation created successfully"
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to create conversation. Please try again.") as ApiResponse<ConversationResponse>;
  }
}

/**
 * @function getConversations
 * @description Fetches all conversations for the current user
 * @returns Promise<ApiResponse<ConversationsResponse>> - Response from the server
 * @route GET /message/getConversation
 */
export async function getConversations(): Promise<ApiResponse<ConversationsResponse>> {
  try {
    const response = await axiosInstance.get(`/message/getConversation`);
    return {
      success: true,
      data: response.data,
      message: "Conversations fetched successfully"
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to fetch conversations. Please try again.") as ApiResponse<ConversationsResponse>;
  }
}

/**
 * @function createMessage
 * @description Creates a new message in a conversation
 * @param messageData - Message data with conversationId, msg, and recipientId
 * @returns Promise<ApiResponse<MessageResponse>> - Response from the server
 * @route POST /message/createMessage
 */
export async function createMessage(
  messageData: CreateMessageData
): Promise<ApiResponse<MessageResponse>> {
  try {
    if (!messageData.conversationId || !messageData.msg || !messageData.recipientId) {
      throw new Error("ConversationId, message, and recipientId are required");
    }

    if (messageData.msg.trim().length === 0) {
      throw new Error("Message cannot be empty");
    }

    const response = await axiosInstance.post(`/message/createMessage`, messageData);
    return {
      success: true,
      data: response.data,
      message: "Message sent successfully"
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to send message. Please try again.") as ApiResponse<MessageResponse>;
  }
}

/**
 * @function getMessages
 * @description Fetches messages for a specific conversation
 * @param conversationId - ID of the conversation
 * @returns Promise<ApiResponse<MessagesResponse>> - Response from the server
 * @route GET /message/messagesCombo/:id
 */
export async function getMessages(
  conversationId: string
): Promise<ApiResponse<MessagesResponse>> {
  try {
    if (!conversationId) {
      throw new Error("Conversation ID is required");
    }

    const response = await axiosInstance.get(`/message/messagesCombo/${conversationId}`);
    return {
      success: true,
      data: response.data,
      message: "Messages fetched successfully"
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to fetch messages. Please try again.") as ApiResponse<MessagesResponse>;
  }
}

/**
 * @function getLastMessage
 * @description Fetches the last message from a conversation
 * @param conversationId - ID of the conversation
 * @returns Promise<ApiResponse<LastMessageResponse>> - Response from the server
 * @route GET /message/lastMessages/:id
 */
export async function getLastMessage(
  conversationId: string
): Promise<ApiResponse<LastMessageResponse>> {
  try {
    if (!conversationId) {
      throw new Error("Conversation ID is required");
    }

    const response = await axiosInstance.get(`/message/lastMessages/${conversationId}`);
    return {
      success: true,
      data: response.data,
      message: "Last message fetched successfully"
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to fetch last message. Please try again.") as ApiResponse<LastMessageResponse>;
  }
}

/**
 * @function markMessagesAsRead
 * @description Marks all messages in a conversation as read
 * @param conversationId - ID of the conversation
 * @returns Promise<ApiResponse> - Response from the server
 * @route PUT /message/readAllMessage/:id
 */
export async function markMessagesAsRead(conversationId: string): Promise<ApiResponse> {
  try {
    if (!conversationId) {
      throw new Error("Conversation ID is required");
    }

    const response = await axiosInstance.put(`/message/readAllMessage/${conversationId}`);
    return {
      success: true,
      data: response.data,
      message: "Messages marked as read successfully"
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to mark messages as read. Please try again.");
  }
}

/**
 * @function getUnreadMessageCount
 * @description Fetches the count of unread messages for the current user
 * @returns Promise<ApiResponse<UnreadCountResponse>> - Response from the server
 * @route GET /message/unreadMessage
 */
export async function getUnreadMessageCount(): Promise<ApiResponse<UnreadCountResponse>> {
  try {
    const response = await axiosInstance.get(`/message/unreadMessage`);
    return {
      success: true,
      data: response.data,
      message: "Unread message count fetched successfully"
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to fetch unread message count. Please try again.") as ApiResponse<UnreadCountResponse>;
  }
}
import { User } from "./user";

/**
 * @interface ConversationI
 * @description Interface for conversation data
 */
export interface ConversationI {
  _id: string;
  conversation: User[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * @interface MessageI
 * @description Interface for message data
 */
export interface MessageI {
  _id: string;
  conversationId: string;
  senderId: User | string;
  recipientId: User | string;
  msg: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * @interface CreateConversationData
 * @description Interface for creating a new conversation
 */
export interface CreateConversationData {
  senderId: string;
  receiverId: string;
}

/**
 * @interface CreateMessageData
 * @description Interface for creating a new message
 */
export interface CreateMessageData {
  conversationId: string;
  msg: string;
  recipientId: string;
}

/**
 * @interface ConversationResponse
 * @description Interface for conversation API response
 */
export interface ConversationResponse {
  conversation: ConversationI;
}

/**
 * @interface ConversationsResponse
 * @description Interface for conversations list API response
 */
export interface ConversationsResponse {
  result: ConversationI[];
}

/**
 * @interface MessagesResponse
 * @description Interface for messages API response
 */
export interface MessagesResponse {
  result: MessageI[];
  otheruser: User;
}

/**
 * @interface MessageResponse
 * @description Interface for single message API response
 */
export interface MessageResponse {
  messages: MessageI;
}

/**
 * @interface LastMessageResponse
 * @description Interface for last message API response
 */
export interface LastMessageResponse {
  result: MessageI[];
}

/**
 * @interface UnreadCountResponse
 * @description Interface for unread message count API response
 */
export interface UnreadCountResponse {
  result: number;
}

/**
 * @interface MessageSocketData
 * @description Interface for socket message data
 */
export interface MessageSocketData {
  sender: string;
  receiver: string;
  message: string;
  conversationId: string;
}

// Legacy interface for backward compatibility
export type conversationI = CreateConversationData;
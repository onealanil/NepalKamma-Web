/**
 * @file socket.ts
 * @description TypeScript types for Socket.IO client implementation
 */

export interface OnlineUser {
  userId: string;
  socketId: string;
}

export interface SocketMessage {
  sender: string;
  receiver: string;
  message: string;
  conversationId: string;
  timestamp?: string;
}

export interface SocketNotification {
  _id: string;
  receiver: string;
  sender: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ConversationOpenedData {
  conversationId: string;
  senderId: string;
}

export interface AddUserData {
  userId: string;
  username: string;
}

// Socket event types for type safety
export interface ServerToClientEvents {
  getU: (users: OnlineUser[]) => void;
  textMessageFromBack: (message: SocketMessage) => void;
  notificationFromBack: (notification: SocketNotification) => void;
  notificationForLocationAndRecommend: (notification: SocketNotification) => void;
  accountDeactivation: () => void;
  ping: () => void;
  connect: () => void;
  disconnect: () => void;
  connect_error: (error: Error) => void;
}

export interface ClientToServerEvents {
  addUser: (data: AddUserData) => void;
  getOnlineUsers: () => void;
  conversationOpened: (data: ConversationOpenedData) => void;
  textMessage: (message: SocketMessage) => void;
  notification: (notification: Omit<SocketNotification, '_id' | 'createdAt'>) => void;
  removeUser: () => void;
  pong: () => void;
}

export interface SocketContextType {
  socket: SocketType | null;
  isConnected: boolean;
  onlineUsers: OnlineUser[];
  connectionError: string | null;
  
  // Methods
  sendMessage: (message: Omit<SocketMessage, 'timestamp'>) => void;
  sendNotification: (notification: Omit<SocketNotification, '_id' | 'createdAt'>) => void;
  markConversationAsRead: (conversationId: string, senderId: string) => void;
  joinUser: (userId: string, username: string) => void;
  leaveUser: () => void;
  getOnlineUsers: () => void;
  isUserOnline: (userId: string) => boolean;
}

export type SocketType = import('socket.io-client').Socket<ServerToClientEvents, ClientToServerEvents>;

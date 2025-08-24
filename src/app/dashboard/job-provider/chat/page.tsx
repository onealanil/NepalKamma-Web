"use client";

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronDown, Edit3, Search, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { useConversations } from '@/hooks/message/useConversations';
import { useUnreadCount } from '@/hooks/message/useUnreadCount';
import { useAuthStore } from '@/store/authStore';
import { getLastMessage } from '@/lib/message/message-api';
import { ConversationI, MessageI } from '@/types/message';
import { ErrorToast } from '@/components/ui/Toast';
import clientLogger from '@/utils/logger';

interface ConversationWithLastMessage extends ConversationI {
  lastMessage?: MessageI;
}

export default function ChatPageProvider() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { conversations, isLoading, isError, mutate } = useConversations();
  const { unreadCount } = useUnreadCount();

  const [conversationsWithLastMessage, setConversationsWithLastMessage] = useState<ConversationWithLastMessage[]>([]);
  const [isLoadingLastMessages, setIsLoadingLastMessages] = useState(false);

  // Fetch last messages for each conversation
  const fetchLastMessages = useCallback(async () => {
    if (!conversations.length) return;

    setIsLoadingLastMessages(true);
    try {
      const conversationsWithMessages = await Promise.all(
        conversations.map(async (conversation) => {
          try {
            const response = await getLastMessage(conversation._id);
            const lastMessage = response.success && response.data?.result?.[0]
              ? response.data.result[0]
              : undefined;

            return {
              ...conversation,
              lastMessage
            };
          } catch (error) {
            clientLogger.error(`Error fetching last message for conversation ${conversation._id}:`, error);
            return {
              ...conversation,
              lastMessage: undefined
            };
          }
        })
      );

      // Sort by last message time (most recent first)
      conversationsWithMessages.sort((a, b) => {
        const aTime = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
        const bTime = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
        return bTime - aTime;
      });

      setConversationsWithLastMessage(conversationsWithMessages);
    } catch (error) {
      clientLogger.error('Error fetching last messages:', error);
      ErrorToast('Failed to load recent messages');
    } finally {
      setIsLoadingLastMessages(false);
    }
  }, [conversations]);

  useEffect(() => {
    fetchLastMessages();
  }, [fetchLastMessages]);

  const clickedConversationHandler = (conversationId: string) => {
    router.push(`/dashboard/job-provider/chat/${conversationId}`);
  };

  const getOtherUser = (conversation: ConversationI) => {
    return conversation.conversation.find(u => u._id !== user?._id);
  };

  const isMessageUnread = (message: MessageI) => {
    return message.senderId !== user?._id && !message.isRead;
  };

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-semibold mb-4">Failed to load conversations</p>
          <button
            onClick={() => mutate()}
            className="bg-primary text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full flex flex-col p-4 max-w-md mx-auto lg:max-w-2xl">
        {/* Header */}
        <div className="mb-4 flex justify-between items-center">
          <button
            onClick={() => router.push('/dashboard/job-provider')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} className="text-gray-600" />
          </button>

          <div className="flex items-center gap-1">
            <span className="text-black font-bold text-lg">
              {user?.username || 'Messages'}
            </span>
            <ChevronDown size={20} className="text-black" />
          </div>

          <div className="relative">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Edit3 size={20} className="text-black" />
            </button>
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </div>
            )}
          </div>
        </div>

        {/* Online Users Horizontal Scroll */}
        <div className="mb-6">
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-4 min-w-max px-2">
              {conversationsWithLastMessage.slice(0, 10).map((conversation) => {
                const otherUser = getOtherUser(conversation);
                return (
                  <div
                    key={conversation._id}
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => clickedConversationHandler(conversation._id)}
                  >
                    <div className="relative">
                      <Image
                        src={otherUser?.profilePic?.url || 'https://picsum.photos/100/100'}
                        alt={otherUser?.username || 'User'}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      {/* Online status - you can implement this with Socket.IO later */}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-400 rounded-full border-2 border-white"></div>
                    </div>
                    <span className="mt-2 text-xs font-semibold text-black text-center max-w-[60px] truncate">
                      {otherUser?.username || 'Unknown'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Messages Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black">Messages</h2>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Search size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto max-h-[60vh]">
          {isLoading || isLoadingLastMessages ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex gap-4 p-4 border-b border-gray-100">
                  <div className="w-14 h-14 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : conversationsWithLastMessage.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-semibold mb-2">No Conversations Yet</p>
              <p className="text-gray-400 text-sm">Start messaging by contacting gig workers!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {conversationsWithLastMessage.map((conversation) => {
                const otherUser = getOtherUser(conversation);
                const lastMessage = conversation.lastMessage;
                const isUnread = lastMessage && isMessageUnread(lastMessage);

                return (
                  <button
                    key={conversation._id}
                    onClick={() => clickedConversationHandler(conversation._id)}
                    className="w-full text-left transition-colors rounded-lg"
                  >
                    <div className="flex gap-4 p-4 border-b border-gray-100">
                      {/* Profile Image */}
                      <div className="flex-shrink-0">
                        <Image
                          src={otherUser?.profilePic?.url || 'https://picsum.photos/100/100'}
                          alt={otherUser?.username || 'User'}
                          width={56}
                          height={56}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                      </div>

                      {/* Message Content */}
                      <div className="flex-1 min-w-0">
                        {/* Name and Time */}
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-semibold text-black text-base truncate">
                            {otherUser?.username || 'Unknown User'}
                          </h3>
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                            {lastMessage?.createdAt &&
                              formatDistanceToNow(new Date(lastMessage.createdAt), { addSuffix: true })
                            }
                          </span>
                        </div>

                        {/* Last Message */}
                        <div className="flex items-center">
                          <p
                            className={`text-sm truncate ${
                              isUnread
                                ? 'text-black font-semibold'
                                : 'text-gray-500'
                            }`}
                          >
                            {lastMessage?.msg || 'No messages yet'}
                          </p>

                          {/* Unread indicator */}
                          {isUnread && (
                            <div className="w-2 h-2 bg-primary rounded-full ml-2 flex-shrink-0"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
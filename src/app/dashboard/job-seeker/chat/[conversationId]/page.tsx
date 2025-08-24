"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, Send, Phone, MoreVertical } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { useMessages } from '@/hooks/message/useMessages';
import { useMessageStore } from '@/store/messageStore';
import { useAuthStore } from '@/store/authStore';
import { CreateMessageData } from '@/types/message';
import { ErrorToast, SuccessToast } from '@/components/ui/Toast';
import clientLogger from '@/utils/logger';
import Link from 'next/link';
import { useSocketMessages } from '@/hooks/socket/useSocketMessages';
import { useOnlineStatusIndicator } from '@/hooks/socket/useSocketOnlineUsers';

export default function ConversationPage() {
    const router = useRouter();
    const params = useParams();
    const conversationId = params.conversationId as string;
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { user } = useAuthStore();
    const { messages: rawMessages, otherUser, isLoading, isError, mutate } = useMessages(conversationId);
    const { createMessageAction, markAsReadAction, isLoading: isSendingMessage } = useMessageStore();

    // Sort messages chronologically (oldest first)
    const messages = rawMessages.sort((a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    // Socket.IO integration
    const { sendSocketMessage, markAsRead: socketMarkAsRead, isConnected } = useSocketMessages({
        conversationId,
        onMessageReceived: () => {
            // Refresh messages when new message received
            mutate();
        }
    });

    // Online status for other user
    const { isOnline: isOtherUserOnline, getStatusClasses } = useOnlineStatusIndicator(otherUser?._id || '');

    // Mark messages as read when conversation opens
    useEffect(() => {
        if (conversationId && messages.length > 0) {
            markAsReadAction(conversationId);
            // Also mark as read via socket for real-time updates
            if (isConnected) {
                socketMarkAsRead();
            }
        }
    }, [conversationId, messages.length, markAsReadAction, isConnected, socketMarkAsRead]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Send message handler
    const handleSendMessage = useCallback(async () => {
        if (!newMessage.trim() || !user?._id || !otherUser?._id || !conversationId) {
            return;
        }

        const messageText = newMessage.trim();
        setNewMessage(''); // Clear input immediately for better UX
        setIsSending(true);

        const messageData: CreateMessageData = {
            conversationId,
            msg: messageText,
            recipientId: otherUser._id,
        };

        try {
            const sentMessage = await createMessageAction(messageData);
            if (sentMessage) {
                // Send via Socket.IO for real-time delivery
                if (isConnected && otherUser?._id) {
                    sendSocketMessage(otherUser._id, messageText, conversationId);
                }

                // Refresh messages to get the latest
                mutate();
                SuccessToast('Message sent!');
            } else {
                ErrorToast('Failed to send message');
                setNewMessage(messageText); // Restore message on failure
            }
        } catch (error) {
            ErrorToast('Failed to send message. Please try again.');
            setNewMessage(messageText); // Restore message on failure
            clientLogger.error('Send message error:', error);
        } finally {
            setIsSending(false);
        }
    }, [newMessage, user, otherUser, conversationId, createMessageAction, mutate, isConnected, sendSocketMessage]);

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        }
    };

    // Handle loading and error states
    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 font-semibold mb-4">Failed to load conversation</p>
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
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            {/* Main Container */}
            <div className="w-full max-w-md lg:max-w-2xl bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-[90vh] lg:h-[95vh]">

                {/* Header */}
                <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ChevronLeft size={20} className="text-gray-600" />
                        </button>

                        <Link href={`/dashboard/job-seeker/profile/user/${otherUser?._id}`}>
                            <div className="flex items-center gap-3 cursor-pointer">
                                <div className="relative">
                                    <Image
                                        src={otherUser?.profilePic?.url || 'https://picsum.photos/100/100'}
                                        alt={otherUser?.username || "User"}
                                        width={40}
                                        height={40}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    {/* Real-time online status */}
                                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusClasses('bg-green-500', 'bg-gray-400')}`}></div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-sm">{otherUser?.username || 'Loading...'}</h3>
                                    <p className="text-xs text-gray-500">
                                        {isOtherUserOnline ? 'Online' : 'Last seen recently'}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="flex items-center gap-1">
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <Phone size={18} className="text-gray-600 cursor-not-allowed" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <MoreVertical size={18} className="text-gray-600 cursor-not-allowed" />
                        </button>
                    </div>
                </div>

                {/* Messages Container - Scrollable */}
                <div className="flex-1 overflow-y-auto px-4 py-4">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[...Array(5)].map((_, index) => (
                                <div key={index} className="flex justify-start">
                                    <div className="bg-gray-200 rounded-2xl px-4 py-3 max-w-[80%] animate-pulse">
                                        <div className="h-4 bg-gray-300 rounded w-32"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No messages yet. Start the conversation!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {messages.map((message, index) => {
                                const isCurrentUser = typeof message.senderId === 'string'
                                    ? message.senderId === user?._id
                                    : message.senderId._id === user?._id;
                                const showDate = index === 0 ||
                                    formatDate(messages[index - 1].createdAt) !== formatDate(message.createdAt);

                                return (
                                    <div key={message._id}>
                                        {showDate && (
                                            <div className="text-center my-6">
                                                <span className="bg-white text-gray-600 text-xs px-3 py-1 rounded-full shadow-sm">
                                                    {formatDate(message.createdAt)}
                                                </span>
                                            </div>
                                        )}

                                        <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                                                <div
                                                    className={`px-4 py-3 rounded-2xl shadow-sm ${isCurrentUser
                                                            ? 'bg-primary text-white rounded-br-md'
                                                            : 'bg-white text-gray-900 rounded-bl-md border border-gray-100'
                                                        }`}
                                                >
                                                    <p className="text-sm leading-relaxed">{message.msg}</p>
                                                </div>
                                                <div className={`flex items-center gap-1 mt-1 px-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                                    <span className="text-xs text-gray-500">
                                                        {formatTime(message.createdAt)}
                                                    </span>
                                                    {isCurrentUser && (
                                                        <div className="flex ml-1">
                                                            <div className={`w-1 h-1 rounded-full ${message.isRead ? 'bg-primary' : 'bg-gray-400'}`}></div>
                                                            <div className={`w-1 h-1 rounded-full ml-0.5 ${message.isRead ? 'bg-primary' : 'bg-gray-400'}`}></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Message Input - Fixed at bottom */}
                <div className="border-t border-gray-200 p-4 flex-shrink-0">
                    <div className="flex items-center justify-center gap-3">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                                placeholder="Type a message..."
                                className="w-full px-4 py-3 bg-gray-100 rounded-full border-none outline-none focus:ring-2 focus:ring-primary text-sm"
                                disabled={isSending || isSendingMessage}
                            />
                        </div>

                        <button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim() || isSending || isSendingMessage}
                            className={`p-3 rounded-full transition-colors flex-shrink-0 ${newMessage.trim() && !isSending && !isSendingMessage
                                    ? 'bg-primary hover:bg-primary/90 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {isSending || isSendingMessage ? (
                                <div className="w-[18px] h-[18px] border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <Send size={18} />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

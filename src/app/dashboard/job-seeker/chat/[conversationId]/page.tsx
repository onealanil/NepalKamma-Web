"use client";

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Send, Paperclip, Smile, Phone, Video, MoreVertical } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

interface User {
    _id: string;
    username: string;
    profilePic?: { url: string };
}

interface Message {
    _id: string;
    msg: string;
    senderId: string;
    createdAt: string;
    isRead: boolean;
}

export default function ConversationPage() {
    const router = useRouter();
    const params = useParams();
    const conversationId = params.conversationId as string;
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [otherUser, setOtherUser] = useState<User | null>(null);
    const [currentUser] = useState<User>({ _id: '1', username: 'John Doe' });
    const [isOnline, setIsOnline] = useState(false);

    // Mock data
    useEffect(() => {
        const mockMessages: Message[] = [
            {
                _id: '1',
                msg: 'Hey! How are you doing?',
                senderId: '2',
                createdAt: new Date(Date.now() - 3600000).toISOString(),
                isRead: true
            },
            {
                _id: '2',
                msg: 'I\'m doing great! Thanks for asking. How about you?',
                senderId: '1',
                createdAt: new Date(Date.now() - 3500000).toISOString(),
                isRead: true
            },
            {
                _id: '3',
                msg: 'I\'m good too! Are you available for the project we discussed?',
                senderId: '2',
                createdAt: new Date(Date.now() - 3400000).toISOString(),
                isRead: true
            },
            {
                _id: '4',
                msg: 'Yes, absolutely! When would you like to start?',
                senderId: '1',
                createdAt: new Date(Date.now() - 3300000).toISOString(),
                isRead: true
            },
            {
                _id: '5',
                msg: 'How about tomorrow morning? We can discuss the details.',
                senderId: '2',
                createdAt: new Date(Date.now() - 1800000).toISOString(),
                isRead: false
            }
        ];

        const mockOtherUser: User = {
            _id: '2',
            username: 'Alice Smith',
            profilePic: { url: 'https://picsum.photos/100/100?random=1' }
        };

        setMessages(mockMessages);
        setOtherUser(mockOtherUser);
        setIsOnline(Math.random() > 0.5);
    }, [conversationId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const message: Message = {
                _id: Date.now().toString(),
                msg: newMessage,
                senderId: currentUser._id,
                createdAt: new Date().toISOString(),
                isRead: false
            };
            setMessages(prev => [...prev, message]);
            setNewMessage('');
        }
    };

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

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            {/* Main Container */}
            <div className="w-full max-w-md lg:max-w-2xl rounded-2xl overflow-hidden flex flex-col h-[90vh] lg:h-[95vh]">
                
                {/* Header */}
                <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => router.back()}
                            className="p-2 rounded-full transition-colors"
                        >
                            <ChevronLeft size={20} className="text-gray-600" />
                        </button>
                        
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img
                                    src={otherUser?.profilePic?.url || 'https://picsum.photos/100/100'}
                                    alt={otherUser?.username}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                {isOnline && (
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 text-sm">{otherUser?.username}</h3>
                                <p className="text-xs text-gray-500">
                                    {isOnline ? 'Online' : 'Last seen recently'}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                        <button className="p-2 rounded-full transition-colors">
                            <Phone size={18} className="text-gray-600" />
                        </button>
                        <button className="p-2 rounded-full transition-colors">
                            <MoreVertical size={18} className="text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Messages Container - Scrollable */}
                <div className="flex-1 overflow-y-auto px-4 py-4">
                    <div className="space-y-4">
                        {messages.map((message, index) => {
                            const isCurrentUser = message.senderId === currentUser._id;
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
                                                className={`px-4 py-3 rounded-2xl shadow-sm ${
                                                    isCurrentUser
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
                </div>

                {/* Message Input - Fixed at bottom */}
                <div className= "border-t border-gray-200 p-4 flex-shrink-0">
                    <div className="flex items-center justify-center gap-3">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Type a message..."
                                className="w-full px-4 py-3 bg-gray-100 rounded-full border-none outline-none focus:ring-2 focus:ring-primary text-sm"
                            />
                        </div>
                        
                        <button 
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                            className={`p-3 rounded-full transition-colors flex-shrink-0 ${
                                newMessage.trim() 
                                    ? 'bg-primary hover:bg-primary text-white shadow-md' 
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

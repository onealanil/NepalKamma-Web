"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronDown, Edit3, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Conversation from '@/components/ui/Conversation';

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

interface ConversationData {
    _id: string;
    conversation: User[];
    lastMessage?: Message[];
}

export default function ChatPageSeeker() {
    const router = useRouter();
    const [conversations, setConversations] = useState<ConversationData[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
    const [user, setUser] = useState<User>({ _id: '1', username: 'John Doe' });
    const [isLoading, setIsLoading] = useState(false);

    // Mock data for demonstration
    useEffect(() => {
        const mockConversations: ConversationData[] = [
            {
                _id: '1',
                conversation: [{
                    _id: '2',
                    username: 'Alice Smith',
                    profilePic: { url: 'https://picsum.photos/100/100?random=1' }
                }],
                lastMessage: [{
                    _id: '1',
                    msg: 'Hey! How are you doing?',
                    senderId: '2',
                    createdAt: new Date().toISOString(),
                    isRead: false
                }]
            },
            {
                _id: '2',
                conversation: [{
                    _id: '3',
                    username: 'Bob Johnson',
                    profilePic: { url: 'https://picsum.photos/100/100?random=2' }
                }],
                lastMessage: [{
                    _id: '2',
                    msg: 'Thanks for the help!',
                    senderId: '1',
                    createdAt: new Date(Date.now() - 3600000).toISOString(),
                    isRead: true
                }]
            }
        ];
        setConversations(mockConversations);
        setOnlineUsers([{ userId: '2' }]);
    }, []);

    const clickedConversationHandler = (conversationId: string) => {
        router.push(`/dashboard/job-seeker/chat/${conversationId}`);
    };

    const formatDistanceToNow = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'now';
        if (minutes < 60) return `${minutes}m`;
        if (hours < 24) return `${hours}h`;
        return `${days}d`;
    };

    return (
        <div className="min-h-screen">
            <div className="w-full flex flex-col p-4 max-w-md mx-auto lg:max-w-2xl">
                {/* Header */}
                <div className="mb-4 flex justify-between items-center">
                    <button
                        onClick={() => router.push('/dashboard/job-seeker')}
                        className="p-2  rounded-full transition-colors"
                    >
                        <ChevronLeft size={24} className="text-gray-600" />
                    </button>

                    <div className="flex items-center gap-1">
                        <span className="text-black font-bold text-lg">
                            {user?.username}
                        </span>
                        <ChevronDown size={20} className="text-black" />
                    </div>

                    <button className="p-2  rounded-full transition-colors">
                        <Edit3 size={20} className="text-black" />
                    </button>
                </div>

                {/* Online Users Horizontal Scroll */}
                <div className="mb-6">
                    <div className="overflow-x-auto pb-2">
                        <div className="flex gap-4 min-w-max px-2">
                            {conversations?.slice(0, 10).map((item) => (
                                <div key={item._id} className="flex flex-col items-center">
                                    <div className="relative">
                                        <img
                                            src={item.conversation[0]?.profilePic?.url || 'https://picsum.photos/100/100'}
                                            alt={item.conversation[0]?.username}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                        {onlineUsers?.find(u => u?.userId === item?.conversation[0]?._id) ? (
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                                        ) : (
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white"></div>
                                        )}
                                    </div>
                                    <span className="mt-2 text-xs font-semibold text-black text-center max-w-[60px] truncate">
                                        {item?.conversation[0]?.username}
                                    </span>
                                </div>
                            ))}
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
                    {conversations.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 font-semibold">No Conversations</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {conversations.map((item) => (
                                <button
                                    key={item._id}
                                    onClick={() => clickedConversationHandler(item._id)}
                                    className="w-full text-left transition-colors rounded-lg"
                                >
                                    <Conversation
                                        data={item}
                                        user={user}
                                        formatDistanceToNow={formatDistanceToNow}
                                        isLoading={isLoading}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

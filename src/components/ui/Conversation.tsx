
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

interface ConversationProps {
    data: ConversationData;
    user: User;
    formatDistanceToNow: (date: Date) => string;
    isLoading: boolean;
}

export default function Conversation({ data, user, formatDistanceToNow, isLoading }: ConversationProps) {
    const lastMessage = data.lastMessage || [];
    const otherUser = data.conversation[0];

    return (
        <div className="flex gap-4 p-4 border-b border-gray-100 transition-colors">
            {/* Profile Image */}
            <div className="flex-shrink-0">
                <img
                    src={otherUser?.profilePic?.url || 'https://picsum.photos/100/100'}
                    alt={otherUser?.username}
                    className="w-14 h-14 rounded-full object-cover"
                />
            </div>

            {/* Message Content */}
            <div className="flex-1 min-w-0">
                {/* Name and Time */}
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-black text-base truncate">
                        {otherUser?.username}
                    </h3>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {lastMessage[0]?.createdAt && 
                            formatDistanceToNow(new Date(lastMessage[0].createdAt))
                        }
                    </span>
                </div>

                {/* Last Message */}
                <div className="flex items-center">
                    {isLoading ? (
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    ) : (
                        <p 
                            className={`text-sm truncate ${
                                lastMessage[0]?.senderId !== user?._id
                                    ? lastMessage[0]?.isRead
                                        ? 'text-gray-500'
                                        : 'text-red-600 font-semibold'
                                    : 'text-gray-500'
                            }`}
                        >
                            {lastMessage[0]?.msg || 'No messages yet'}
                        </p>
                    )}
                    
                    {/* Unread indicator */}
                    {lastMessage[0]?.senderId !== user?._id && !lastMessage[0]?.isRead && (
                        <div className="w-2 h-2 bg-red-500 rounded-full ml-2 flex-shrink-0"></div>
                    )}
                </div>
            </div>
        </div>
    );
}

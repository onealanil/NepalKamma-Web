"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Bell, MessageCircle, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import LeftSideSeeker from '@/components/ui/LeftSideSeeker';

interface Notification {
    id: string;
    title: string;
    message: string;
    image: string;
    type: 'job' | 'message' | 'payment' | 'review' | 'system';
    isRead: boolean;
    createdAt: string;
}

const NotificationLoader = () => (
    <div className="flex items-start gap-3 p-4 mb-2 animate-pulse">
        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
        <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="w-8 h-3 bg-gray-200 rounded"></div>
    </div>
);

const NotificationCard = ({ item }: { item: Notification }) => {
    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'job': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'message': return <MessageCircle className="w-4 h-4 text-blue-500" />;
            case 'payment': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'review': return <Bell className="w-4 h-4 text-yellow-500" />;
            default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
        }
    };

    const formatTime = (dateString: string) => {
        return formatDistanceToNow(new Date(dateString), { addSuffix: false });
    };

    return (
        <div className={`flex items-start gap-3 p-4 mb-2 rounded-lg transition-colors hover:bg-gray-50 ${!item.isRead ? 'bg-primary/5 border-l-4 border-primary' : 'bg-white'}`}>
            {/* Profile Image */}
            <div className="relative">
                <img
                    src={item.image}
                    alt="Notification"
                    className="w-16 h-16 rounded-full object-cover"
                />
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                    {getNotificationIcon(item.type)}
                </div>
            </div>

            {/* Message Content */}
            <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 text-sm mb-1 truncate">
                    {item.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {item.message}
                </p>
                {!item.isRead && (
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                )}
            </div>

            {/* Time */}
            <div className="flex flex-col items-end">
                <span className="text-xs text-gray-500">
                    {formatTime(item.createdAt)}
                </span>
                <Clock className="w-3 h-3 text-gray-400 mt-1" />
            </div>
        </div>
    );
};

export default function NotificationPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        // Simulate loading notifications
        setTimeout(() => {
            const mockNotifications: Notification[] = [
                {
                    id: '1',
                    title: 'Job Application Accepted',
                    message: 'Congratulations! Your application for "Website Development Project" has been accepted by Tech Solutions Ltd.',
                    image: 'https://picsum.photos/100/100?random=1',
                    type: 'job',
                    isRead: false,
                    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: '2',
                    title: 'New Message Received',
                    message: 'Alice Johnson sent you a message regarding the Mobile App UI Design project. Please check your inbox.',
                    image: 'https://picsum.photos/100/100?random=2',
                    type: 'message',
                    isRead: false,
                    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: '3',
                    title: 'Payment Received',
                    message: 'You have received Rs. 35,000 payment for completing the "Logo Design Project". The amount has been credited to your account.',
                    image: 'https://picsum.photos/100/100?random=3',
                    type: 'payment',
                    isRead: false,
                    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: '4',
                    title: 'New Review Received',
                    message: 'Ram Sharma left a 5-star review for your work on "Content Writing Project". Great job!',
                    image: 'https://picsum.photos/100/100?random=4',
                    type: 'review',
                    isRead: true,
                    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: '5',
                    title: 'Job Deadline Reminder',
                    message: 'Reminder: Your "E-commerce Platform Development" project is due in 2 days. Please ensure timely delivery.',
                    image: 'https://picsum.photos/100/100?random=5',
                    type: 'system',
                    isRead: true,
                    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: '6',
                    title: 'Profile View Notification',
                    message: 'Your profile has been viewed 15 times this week. Keep your portfolio updated to attract more clients.',
                    image: 'https://picsum.photos/100/100?random=6',
                    type: 'system',
                    isRead: true,
                    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: '7',
                    title: 'New Job Match',
                    message: 'We found a perfect job match for your skills: "React Developer Needed". Check it out now!',
                    image: 'https://picsum.photos/100/100?random=7',
                    type: 'job',
                    isRead: true,
                    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: '8',
                    title: 'Weekly Summary',
                    message: 'This week you completed 3 jobs, earned Rs. 85,000, and received 2 new reviews. Keep up the great work!',
                    image: 'https://picsum.photos/100/100?random=8',
                    type: 'system',
                    isRead: true,
                    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
                }
            ];

            setNotifications(mockNotifications);
            setIsLoading(false);
        }, 1500);
    }, []);

    const handleBackPress = () => {
        router.push('/dashboard/job-seeker');
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;
    const newNotifications = notifications.filter(n => !n.isRead);
    const olderNotifications = notifications.filter(n => n.isRead);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full max-w-md lg:max-w-7xl mx-auto px-4 pb-20">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Left Sidebar - Hidden on mobile, visible on desktop */}
                    <LeftSideSeeker />
                    
                    {/* Main Content */}
                    <div className="lg:col-span-6 py-6">
                        {/* Header */}
                        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-8">
                                    <button 
                                        onClick={handleBackPress}
                                        className="text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        <ChevronLeft size={30} />
                                    </button>
                                    <h1 className="text-lg font-bold text-gray-900">
                                        Notifications
                                    </h1>
                                </div>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-primary text-sm font-medium hover:text-primary/80 transition-colors"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Loading State */}
                        {isLoading && (
                            <div className="bg-white rounded-xl shadow-sm">
                                {[1, 2, 3, 4, 5].map((item) => (
                                    <NotificationLoader key={item} />
                                ))}
                            </div>
                        )}

                        {/* Content */}
                        {!isLoading && (
                            <div className="space-y-6">
                                {/* New Notifications */}
                                {newNotifications.length > 0 && (
                                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                        <div className="p-4 border-b border-gray-100">
                                            <div className="flex items-center justify-between">
                                                <h2 className="font-bold text-gray-900">New</h2>
                                                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                                                    {newNotifications.length}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            {newNotifications.slice(0, 10).map((notification) => (
                                                <NotificationCard key={notification.id} item={notification} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Older Notifications */}
                                {olderNotifications.length > 0 && (
                                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                        <div className="p-4 border-b border-gray-100">
                                            <h2 className="font-bold text-gray-900">Earlier</h2>
                                        </div>
                                        <div>
                                            {olderNotifications.map((notification) => (
                                                <NotificationCard key={notification.id} item={notification} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Empty State */}
                                {notifications.length === 0 && !isLoading && (
                                    <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                                        <div className="text-4xl mb-4">🔔</div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                                            No Notifications
                                        </h3>
                                        <p className="text-gray-500 font-medium">
                                            You&apos;re all caught up! Check back later for updates.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar - Hidden on mobile, visible on desktop */}
                    <div className="hidden lg:block lg:col-span-3 py-6">
                        <div className="sticky top-6 space-y-6">
                            {/* Notification Stats */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4">Notification Summary</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total</span>
                                        <span className="font-bold text-primary">{notifications.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Unread</span>
                                        <span className="font-bold text-red-500">{unreadCount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Read</span>
                                        <span className="font-bold text-green-600">{notifications.length - unreadCount}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Notification Types */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
                                <div className="space-y-3">
                                    {['job', 'message', 'payment', 'review', 'system'].map((type) => {
                                        const count = notifications.filter(n => n.type === type).length;
                                        return (
                                            <div key={type} className="flex justify-between">
                                                <span className="text-gray-600 capitalize">{type}s</span>
                                                <span className="font-bold text-gray-900">{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => router.push('/dashboard/job-seeker/chat')}
                                        className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                                    >
                                        View Messages
                                    </button>
                                    <button
                                        onClick={() => router.push('/dashboard/job-seeker')}
                                        className="w-full bg-primary/10 text-primary py-3 rounded-lg font-semibold hover:bg-primary/20 transition-colors"
                                    >
                                        Dashboard
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
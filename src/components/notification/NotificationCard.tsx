/**
 * @file NotificationCard.tsx
 * @description Individual notification card component
 */

"use client";

import React from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import {
  Bell,
  Briefcase,
  MapPin,
  Eye
} from 'lucide-react';
import { NotificationI, NotificationType } from '@/types/notification';
import { User } from '@/types/user';
import SafeHTML from '../global/SafeHTML';

interface NotificationCardProps {
  notification: NotificationI;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClick?: (notification: NotificationI) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkAsRead,
  onClick
}) => {
  const sender = notification.senderId as User;

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'job_posted':
        return <Briefcase className="w-5 h-5 text-blue-600" />;
      case 'job_posted_location':
        return <MapPin className="w-5 h-5 text-green-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'job_posted':
        return 'border-l-blue-500 bg-blue-50';
      case 'job_posted_location':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getNotificationTitle = (type: NotificationType) => {
    switch (type) {
      case 'job_posted':
        return 'New Job Recommendation';
      case 'job_posted_location':
        return 'Job Near You';
      default:
        return 'Job Notification';
    }
  };

  const handleCardClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification._id);
    }
    onClick?.(notification);
  };

  return (
    <div
      className={`
        relative p-4 border-l-4 rounded-lg shadow-sm transition-all duration-200 cursor-pointer
        ${notification.isRead ? 'bg-white border-l-gray-300' : getNotificationColor(notification.type)}
        hover:shadow-md hover:scale-[1.01]
      `}
      onClick={handleCardClick}
    >
      {/* Unread indicator */}
      {!notification.isRead && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-primary rounded-full"></div>
      )}

      <div className="flex items-start space-x-3">
        {/* Sender Avatar */}
        <div className="flex-shrink-0">
          {sender?.profilePic?.url ? (
            <Image
              src={sender.profilePic.url}
              alt={sender.username}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-green-600 rounded-full flex items-center justify-center text-white font-bold">
              {sender?.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
        </div>

        {/* Notification Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            {getNotificationIcon(notification.type)}
            <h4 className="text-sm font-semibold text-gray-900">
              {getNotificationTitle(notification.type)}
            </h4>
          </div>

          <div className="text-sm text-gray-700 mb-2 line-clamp-2">
            <SafeHTML html={notification?.notification || ""} />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
            </span>

            <div className="flex items-center space-x-2">
              {!notification.isRead && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(notification._id);
                  }}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Mark as read"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Location indicator for location-based notifications */}
      {notification.type === 'job_posted_location' && (
        <div className="mt-2 flex items-center text-xs text-gray-600">
          <MapPin className="w-3 h-3 mr-1" />
          <span>Near your location</span>
        </div>
      )}
    </div>
  );
};

export default NotificationCard;

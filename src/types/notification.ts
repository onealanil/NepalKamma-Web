/**
 * @file notification.ts
 * @description TypeScript types for notification system
 */

import { User } from './user';
import { JobI } from './job';
import { GigI } from './gig';

export interface NotificationI {
  _id: string;
  senderId: User | string;
  recipientId: User | string;
  jobId?: JobI | string | null;
  gigId?: GigI | string | null;
  notification: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export type NotificationType =
  | 'job_posted'           // Job recommendation based on skills
  | 'job_posted_location'; // Job recommendation based on location

export interface NotificationResponse {
  success: boolean;
  data: {
    notifications: NotificationI[];
    totalCount: number;
    unreadCount: number;
    hasMore: boolean;
  };
  message?: string;
}



export interface NotificationFilters {
  type?: NotificationType;
  isRead?: boolean;
  page?: number;
  limit?: number;
}

export interface NotificationStats {
  total: number;
  unread: number;
  recommendedJobs: number;
  nearbyJobs: number;
}

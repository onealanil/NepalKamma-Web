"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Trash2,
  CheckCheck,
  RefreshCw
} from "lucide-react";
import { useNotifications } from "@/hooks/notification/useNotifications";
import { NotificationI, NotificationType } from "@/types/notification";
import NotificationCard from "@/components/notification/NotificationCard";
import { LoadingCard } from "@/components/ui/loader/LoadingCard";

function NotificationPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [typeFilter, setTypeFilter] = useState<NotificationType | "all">("all");

  const {
    notifications,
    isLoading,
    isError,
    totalCount,
    unreadCount,
    hasMore,
    markAsRead,
    markAllAsRead,
    deleteNotif,
    clearRead,
    loadMore,
    refresh,
  } = useNotifications({
    isRead: filter === "all" ? undefined : filter === "read",
    type: typeFilter === "all" ? undefined : typeFilter,
  });

  const handleNotificationClick = useCallback((notification: NotificationI) => {
    // Navigate to job details for both recommendation types
    switch (notification.type) {
      case 'job_posted':
      case 'job_posted_location':
        if (notification.jobId) {
          router.push(`/dashboard/job-seeker/job/${notification.jobId}`);
        }
        break;
      default:
        // For other types, just mark as read
        break;
    }
  }, [router]);

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Failed to load notifications
            </h3>
            <p className="text-gray-600 mb-4">
              There was an error loading your notifications. Please try again.
            </p>
            <button
              onClick={refresh}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg relative">
                <Bell className="w-6 h-6 text-primary" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600">
                  {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={refresh}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-5 h-5 text-gray-600" />
                </button>
              )}

              <button
                onClick={clearRead}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Clear read notifications"
              >
                <Trash2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-4">
            {(["all", "unread", "read"] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors capitalize ${
                  filter === filterType
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {filterType}
                {filterType === "unread" && unreadCount > 0 && (
                  <span className="ml-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="flex flex-wrap gap-2">
            {["all", "job_posted", "job_posted_location"].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type as NotificationType | "all")}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  typeFilter === type
                    ? "bg-primary text-white"
                    : "border border-black py-2 px-3 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {type === "all" ? "All Jobs" :
                 type === "job_posted" ? "Recommended" :
                 type === "job_posted_location" ? "Nearby" : type}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {isLoading && notifications.length === 0 ? (
            // Initial loading state
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white rounded-xl p-6">
                  <LoadingCard />
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            // Empty state
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">🔔</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No notifications found
              </h3>
              <p className="text-gray-600">
                {filter === "unread"
                  ? "You're all caught up! No unread notifications."
                  : filter === "read"
                  ? "No read notifications to show."
                  : "You don't have any notifications yet."}
              </p>
            </div>
          ) : (
            // Notifications list
            notifications.map((notification) => (
              <NotificationCard
                key={notification._id}
                notification={notification}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotif}
                onClick={handleNotificationClick}
              />
            ))
          )}
        </div>

        {/* Load More Button */}
        {hasMore && notifications.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={loadMore}
              disabled={isLoading}
              className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg shadow-sm border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Loading...
                </div>
              ) : (
                "Load More Notifications"
              )}
            </button>
          </div>
        )}

        {/* Stats Footer */}
        {notifications.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Showing {notifications.length} of {totalCount} notifications
              </span>
              <span>
                {unreadCount} unread
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationPage;
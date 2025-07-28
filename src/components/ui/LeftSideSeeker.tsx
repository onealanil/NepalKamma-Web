"use client";

import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

function LeftSideSeeker() {
    const { user, hasHydrated } = useAuthStore();

    if (!hasHydrated || !user) {
        return (
            <div className="hidden lg:block lg:col-span-3 py-6">
                <div className="sticky top-6 space-y-6">
                    {/* Profile Card Skeleton */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
                            <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded mb-4 animate-pulse"></div>
                            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    </div>

                    {/* Quick Actions Skeleton */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center gap-3 p-3">
                                    <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="hidden lg:block lg:col-span-3 py-6">
                <div className="sticky top-6 space-y-6">
                    {/* Profile Card */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-r from-primary to-green-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg">
                                {user?.username.charAt(0)}
                            </div>
                            <h3 className="font-bold text-lg text-gray-900">{user?.username}</h3>
                            <p className="text-gray-500 text-sm mb-4">{user?.email}</p>
                            <button className="w-full bg-primary/10 text-primary py-2 rounded-lg font-semibold hover:bg-primary/20 transition-colors">
                                Edit Profile
                            </button>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <Link href="/dashboard/job-seeker/completed-jobs" className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <span className="text-gray-700">Completed Jobs</span>
                            </Link>
                            <Link href="/dashboard/job-seeker/saved-jobs" className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                </div>
                                <span className="text-gray-700">Saved Jobs</span>
                            </Link>
                            <Link href="/dashboard/job-seeker/my-earning" className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                                <span className="text-gray-700">Earnings</span>
                            </Link>
                            <Link href="/dashboard/job-seeker/my-review" className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                </div>
                                <span className="text-gray-700">Review</span>
                            </Link>
                            <Link href="/dashboard/job-seeker/notification" className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 19H6a2 2 0 01-2-2V7a2 2 0 012-2h5m5 0v6m0 0l3-3m-3 3l-3-3" />
                                    </svg>
                                </div>
                                <span className="text-gray-700">Notification</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LeftSideSeeker;

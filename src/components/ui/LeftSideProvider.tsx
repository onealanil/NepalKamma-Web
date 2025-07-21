

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

function LeftSideProvider() {
    const router = useRouter();
    const [user] = useState<User>({
        id: '1',
        name: 'John Provider',
        email: 'john@provider.com',
        avatar: '/images/avatar.jpg'
    });

    return (
        <>
            <div className="hidden lg:block lg:col-span-3 py-6">
                <div className="sticky top-6 space-y-6">
                    {/* Profile Card */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-r from-primary to-green-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg">
                                {user.name.charAt(0)}
                            </div>
                            <h3 className="font-bold text-lg text-gray-900">{user.name}</h3>
                            <p className="text-gray-500 text-sm mb-4">{user.email}</p>
                            <button className="w-full bg-primary/10 text-primary py-2 rounded-lg font-semibold hover:bg-primary/20 transition-colors">
                                Edit Profile
                            </button>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => router.push('/dashboard/job-provider/post-gig')}
                                className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors bg-primary/10"
                            >
                                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <span className="text-primary font-medium">Post New Gig</span>
                            </button>
                            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <span className="text-gray-700">My Posted Gigs</span>
                            </button>
                            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <span className="text-gray-700">Applicants</span>
                            </button>
                            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                                <span className="text-gray-700">Earnings</span>
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4">Your Stats</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Active Gigs</span>
                                <span className="font-bold text-primary">2</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Applicants</span>
                                <span className="font-bold text-green-600">13</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Completed Jobs</span>
                                <span className="font-bold text-blue-600">8</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Success Rate</span>
                                <span className="font-bold text-yellow-600">85%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LeftSideProvider;
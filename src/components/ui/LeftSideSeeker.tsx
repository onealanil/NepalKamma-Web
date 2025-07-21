"use client";

import { useState } from 'react';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

function LeftSideSeeker() {
    const [user] = useState<User>({
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
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
                            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <span className="text-gray-700">My Applications</span>
                            </button>
                            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                </div>
                                <span className="text-gray-700">Saved Jobs</span>
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
                </div>
            </div>
        </>
    )
}

export default LeftSideSeeker;
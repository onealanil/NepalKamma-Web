
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LeftSideProvider from '@/components/ui/LeftSideProvider';
import { Gig, User } from '@/types/job-provider/home';

function JobProviderDashboard() {
    const router = useRouter();
    const [user] = useState<User>({
        id: '1',
        name: 'John Provider',
        email: 'john@provider.com'
    });

    const [isPopular, setIsPopular] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [selectedDistance, setSelectedDistance] = useState('5km');
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
    const [showGigModal, setShowGigModal] = useState(false);

    // Mock data for posted gigs
    const [postedGigs, setPostedGigs] = useState<Gig[]>([
        {
            _id: '1',
            title: 'Fix Ceiling Fan',
            description: 'Need someone to repair my ceiling fan that stopped working. Quick job, should take 1-2 hours.',
            location: 'Thamel, Kathmandu',
            salary: 1500,
            createdAt: '2024-01-15',
            category: 'Electrical',
            urgency: 'medium',
            distance: '0.5 km',
            applicants: 5,
            status: 'active'
        },
        {
            _id: '2',
            title: 'Guitar Lessons',
            description: 'Looking for a guitar teacher for my 12-year-old son. Beginner level, 2 sessions per week.',
            location: 'Lalitpur',
            salary: 3000,
            createdAt: '2024-01-14',
            category: 'Teaching',
            urgency: 'low',
            distance: '1.2 km',
            applicants: 8,
            status: 'active'
        }
    ]);

    const [nearbyGigs, setNearbyGigs] = useState<Gig[]>([]);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1500);
    }, []);

    const setPopularTrueFunction = () => setIsPopular(true);
    const setPopularFalseFunction = () => setIsPopular(false);

    const handleGigSelect = (gig: Gig) => {
        setSelectedGig(gig);
        setShowGigModal(true);
    };

    const getCurrentGigs = () => {
        return isPopular ? postedGigs : nearbyGigs;
    };

    const resetSearch = () => {
        setSearchText('');
        setSelectedDistance('5km');
    };

    const handleOkFunction = () => {
        setModalVisible(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full max-w-md lg:max-w-7xl mx-auto px-4 pb-20">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    <LeftSideProvider />
                    {/* Main Content */}
                    <div className="lg:col-span-6 py-6">
                        {/* Header Section */}
                        <div className="mb-6">
                            <div className="text-center lg:text-left mb-6">
                                <h2 className="text-gray-500 text-lg font-semibold mb-1">Discover</h2>
                                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                                    services and freelancers
                                </h1>
                            </div>

                            {/* Search */}
                            <div className="mb-6">
                                <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm border border-gray-100">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search for services..."
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        className="flex-1 outline-none text-gray-700"
                                    />
                                    <button
                                        onClick={() => setModalVisible(true)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="bg-white rounded-xl p-1 mb-6 shadow-sm">
                            <div className="flex">
                                <button
                                    onClick={setPopularTrueFunction}
                                    className={`flex-1 py-3 px-4 text-center font-bold text-sm rounded-lg transition-all ${isPopular
                                        ? 'bg-primary text-white shadow-sm border-b-2 border-primary'
                                        : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                >
                                    Browse Gigs
                                </button>
                                <button
                                    onClick={setPopularFalseFunction}
                                    className={`flex-1 py-3 px-4 text-center font-bold text-sm rounded-lg transition-all ${!isPopular
                                        ? 'bg-primary text-white shadow-sm border-b-2 border-primary'
                                        : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                >
                                    Near by Gigs
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="min-h-[60vh]">
                            {isLoading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3, 4, 5].map((item) => (
                                        <div key={item} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                                            <div className="flex items-start gap-4">
                                                <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                                                <div className="flex-1">
                                                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                                    <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
                                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    {getCurrentGigs().length === 0 ? (
                                        <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                                            <div className="text-4xl mb-4">📋</div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                                {isPopular ? 'No Gigs available' : 'No near by Gigs available'}
                                            </h3>
                                            <p className="text-gray-600 mb-6">
                                                {isPopular ? 'Post your first gig to get started' : 'Enable location to find gigs in your area'}
                                            </p>
                                            <button
                                                onClick={() => router.push('/dashboard/job-provider/post-gig')}
                                                className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                                            >
                                                Post a Gig
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {getCurrentGigs().map((gig) => (
                                                <div
                                                    key={gig._id}
                                                    onClick={() => handleGigSelect(gig)}
                                                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-green-100 rounded-xl flex items-center justify-center">
                                                            <span className="text-2xl">
                                                                {gig.category === 'Electrical' ? '⚡' :
                                                                    gig.category === 'Teaching' ? '📚' : '🔧'}
                                                            </span>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-start justify-between mb-2">
                                                                <h3 className="font-bold text-gray-900 text-lg">{gig.title}</h3>
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${gig.urgency === 'high' ? 'bg-red-100 text-red-700' :
                                                                        gig.urgency === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                                            'bg-green-100 text-green-700'
                                                                        }`}>
                                                                        {gig.urgency}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{gig.description}</p>
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                                    <div className="flex items-center gap-1">
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                        </svg>
                                                                        <span>{gig.location}</span>
                                                                    </div>
                                                                    {gig.distance && (
                                                                        <span>• {gig.distance}</span>
                                                                    )}
                                                                    {gig.applicants && (
                                                                        <span>• {gig.applicants} applicants</span>
                                                                    )}
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="text-2xl font-bold text-primary">₹{gig.salary.toLocaleString()}</div>
                                                                    <div className="text-xs text-gray-500">per job</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="hidden lg:block lg:col-span-3 py-6">
                        <div className="sticky top-6 space-y-6">
                            {/* Quick Actions */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => router.push('/dashboard/job-provider/create-job')}
                                        className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors bg-primary/10"
                                    >
                                        <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </div>
                                        <span className="text-primary font-medium">Post New Job</span>
                                    </button>
                                    <button
                                        onClick={() => router.push("/dashboard/job-provider/my-jobs")}
                                        className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <span className="text-gray-700">My Posted Jobs</span>
                                    </button>
                                    <button
                                        className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <span className="text-gray-700">Applicants</span>
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
                                </div>
                            </div>

                            {/* Tips */}
                            <div className="bg-gradient-to-br from-primary/10 to-green-100 rounded-xl p-6">
                                <h3 className="font-bold text-gray-900 mb-2">💡 Pro Tip</h3>
                                <p className="text-sm text-gray-700 mb-3">
                                    Add detailed descriptions and fair pricing to attract quality freelancers!
                                </p>
                                <button className="text-primary font-semibold text-sm hover:text-primary/80">
                                    Learn More →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Modal */}
            {isModalVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Filter Options</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Distance</label>
                                <select
                                    value={selectedDistance}
                                    onChange={(e) => setSelectedDistance(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                >
                                    <option value="1km">1 km</option>
                                    <option value="5km">5 km</option>
                                    <option value="10km">10 km</option>
                                    <option value="25km">25 km</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={resetSearch}
                                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Reset
                            </button>
                            <button
                                onClick={handleOkFunction}
                                className="flex-1 py-3 px-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Gig Detail Modal */}
            {showGigModal && selectedGig && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">{selectedGig.title}</h3>
                            <button
                                onClick={() => setShowGigModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <p className="text-gray-700">{selectedGig.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>📍 {selectedGig.location}</span>
                                <span>💰 ₹{selectedGig.salary.toLocaleString()}</span>
                                <span>👥 {selectedGig.applicants} applicants</span>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button className="flex-1 py-3 px-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                                    View Applicants
                                </button>
                                <button className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                                    Edit Gig
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default JobProviderDashboard;

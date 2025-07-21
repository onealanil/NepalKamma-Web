"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LeftSideSeeker from '@/components/ui/LeftSideSeeker';
import { Job } from '@/types/job-seeker/home';

function JobSeekerDashboard() {
    const router = useRouter();
    const [currentTab, setCurrentTab] = useState<'Best Matches' | 'Most Recent' | 'Nearby'>('Best Matches');
    const [isLoading, setIsLoading] = useState(true);
    const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [showJobModal, setShowJobModal] = useState(false);

    // Mock data with more realistic content
    const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([
        {
            _id: '1',
            title: 'Fix Ceiling Fan',
            description: 'Need someone to repair my ceiling fan that stopped working. Quick job, should take 1-2 hours.',
            location: 'Thamel, Kathmandu',
            salary: 1500,
            createdAt: '2024-01-15',
            category: 'Electrical',
            urgency: 'medium',
            distance: '0.5 km'
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
            distance: '1.2 km'
        }
    ]);
    const [recentJobs, setRecentJobs] = useState<Job[]>([]);
    const [nearbyJobs, setNearbyJobs] = useState<Job[]>([]);

    useEffect(() => {
        // Simulate loading
        setTimeout(() => {
            setIsLoading(false);
        }, 1500);
    }, []);

    const setCurrentTabHandler = (tab: 'Best Matches' | 'Most Recent' | 'Nearby') => {
        setCurrentTab(tab);
    };

    const handleJobSelect = (job: Job) => {
        setSelectedJob(job);
        setShowJobModal(true);
    };

    const handleRetryPermission = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                () => setLocationPermissionDenied(false),
                () => setLocationPermissionDenied(true)
            );
        }
    };

    const getCurrentJobs = () => {
        switch (currentTab) {
            case 'Best Matches':
                return recommendedJobs;
            case 'Most Recent':
                return recentJobs;
            case 'Nearby':
                return nearbyJobs;
            default:
                return [];
        }
    };

    const getUrgencyColor = (urgency?: string) => {
        switch (urgency) {
            case 'high': return 'bg-red-100 text-red-600';
            case 'medium': return 'bg-yellow-100 text-yellow-600';
            case 'low': return 'bg-green-100 text-green-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getEmptyMessage = () => {
        switch (currentTab) {
            case 'Best Matches':
                return {
                    title: 'No recommended jobs available',
                    subtitle: 'Complete your profile to get personalized job recommendations',
                    icon: '🎯'
                };
            case 'Most Recent':
                return {
                    title: 'No recent jobs available',
                    subtitle: 'Check back later for new opportunities',
                    icon: '⏰'
                };
            case 'Nearby':
                return {
                    title: 'No nearby jobs available',
                    subtitle: 'Enable location to find jobs in your area',
                    icon: '📍'
                };
            default:
                return { title: '', subtitle: '', icon: '' };
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 ">
            <div className="w-full max-w-md lg:max-w-7xl mx-auto px-4 pb-20">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Left Sidebar - Hidden on mobile, visible on desktop */}
                    <LeftSideSeeker/>
                    {/* Main Content */}
                    <div className="lg:col-span-6 py-6">
                        {/* Hero Section */}
                        <div className="mb-6">
                            <div className="text-center lg:text-left mb-6">
                                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                                    Find Your Next <span className="text-primary">Gig</span>
                                </h1>
                                <p className="text-gray-600">Discover local opportunities in your neighborhood</p>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                <div className="bg-white rounded-xl p-3 lg:p-4 text-center shadow-sm">
                                    <div className="text-2xl lg:text-3xl font-bold text-primary">12</div>
                                    <div className="text-xs lg:text-sm text-gray-500">Available</div>
                                </div>
                                <div className="bg-white rounded-xl p-3 lg:p-4 text-center shadow-sm">
                                    <div className="text-2xl lg:text-3xl font-bold text-green-600">5</div>
                                    <div className="text-xs lg:text-sm text-gray-500">Applied</div>
                                </div>
                                <div className="bg-white rounded-xl p-3 lg:p-4 text-center shadow-sm">
                                    <div className="text-2xl lg:text-3xl font-bold text-blue-600">₹8.5k</div>
                                    <div className="text-xs lg:text-sm text-gray-500">Earned</div>
                                </div>
                            </div>

                            {/* Search */}
                            <div 
                                className="mb-6 cursor-pointer"
                                onClick={() => router.push('/dashboard/job-seeker/explore')}
                            >
                                <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-500 flex-1">Search for gigs near you...</span>
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="bg-white rounded-xl p-1 mb-6 shadow-sm">
                            <div className="flex">
                                {(['Best Matches', 'Most Recent', 'Nearby'] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setCurrentTabHandler(tab)}
                                        className={`flex-1 py-3 px-2 text-center font-semibold text-sm rounded-lg transition-all ${
                                            currentTab === tab
                                                ? 'bg-primary text-white shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        {tab === 'Nearby' ? 'Nearby' : tab.split(' ')[0]}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="min-h-[60vh]">
                            {isLoading && (
                                <div className="space-y-4">
                                    {[1, 2, 3].map((item) => (
                                        <div key={item} className="bg-white rounded-xl p-4 shadow-sm">
                                            <div className="animate-pulse">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                                                </div>
                                                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                                                <div className="h-3 bg-gray-200 rounded w-2/3 mb-3"></div>
                                                <div className="flex justify-between items-center">
                                                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                                                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {locationPermissionDenied && (
                                <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Location Access Needed</h3>
                                    <p className="text-gray-600 mb-6">Enable location to discover gigs in your neighborhood</p>
                                    <button
                                        onClick={handleRetryPermission}
                                        className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                                    >
                                        Enable Location
                                    </button>
                                </div>
                            )}

                            {!isLoading && !locationPermissionDenied && (
                                <>
                                    {getCurrentJobs().length === 0 ? (
                                        <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                                            <div className="text-4xl mb-4">{getEmptyMessage().icon}</div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                                {getEmptyMessage().title}
                                            </h3>
                                            <p className="text-gray-600 mb-6">
                                                {getEmptyMessage().subtitle}
                                            </p>
                                            <button 
                                                onClick={() => router.push('/profile')}
                                                className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                                            >
                                                Complete Profile
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {getCurrentJobs().map((job) => (
                                                <div
                                                    key={job._id}
                                                    onClick={() => handleJobSelect(job)}
                                                    className="bg-white rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-primary/20"
                                                >
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="flex-1">
                                                            <h3 className="font-bold text-lg text-gray-900 mb-1">{job.title}</h3>
                                                            <div className="flex items-center gap-2 mb-2">
                                                                {job.category && (
                                                                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                                                                        {job.category}
                                                                    </span>
                                                                )}
                                                                {job.urgency && (
                                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(job.urgency)}`}>
                                                                        {job.urgency}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-xl font-bold text-primary">₹{job.salary}</div>
                                                            {job.distance && (
                                                                <div className="text-xs text-gray-500">{job.distance}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    <p className="text-gray-600 mb-3 line-clamp-2">{job.description}</p>
                                                    
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-1 text-gray-500">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            </svg>
                                                            <span className="text-sm">{job.location}</span>
                                                        </div>
                                                        <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
                                                            Apply Now
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Job Modal */}
                        {showJobModal && selectedJob && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
                                <div className="bg-white w-full rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
                                        <button
                                            onClick={() => setShowJobModal(false)}
                                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-4 mb-6">
                                        <div className="flex items-center gap-2">
                                            {selectedJob.category && (
                                                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                                                    {selectedJob.category}
                                                </span>
                                            )}
                                            {selectedJob.urgency && (
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(selectedJob.urgency)}`}>
                                                    {selectedJob.urgency} priority
                                                </span>
                                            )}
                                        </div>
                                        
                                        <p className="text-gray-700 leading-relaxed">{selectedJob.description}</p>
                                        
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-600 flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    </svg>
                                                    {selectedJob.location}
                                                </span>
                                                {selectedJob.distance && (
                                                    <span className="text-sm text-gray-500">{selectedJob.distance} away</span>
                                                )}
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Payment</span>
                                                <span className="text-2xl font-bold text-primary">₹{selectedJob.salary}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => setShowJobModal(false)}
                                            className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                                        >
                                            Save for Later
                                        </button>
                                        <button className="flex-1 bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 transition-colors">
                                            Apply Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar - Hidden on mobile, visible on desktop */}
                    <div className="hidden lg:block lg:col-span-3 py-6">
                        <div className="sticky top-6 space-y-6">
                            {/* Job Alerts */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4">Job Alerts</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-blue-900">Electrical Work</p>
                                            <p className="text-sm text-blue-600">3 new jobs</p>
                                        </div>
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-green-900">Teaching</p>
                                            <p className="text-sm text-green-600">1 new job</p>
                                        </div>
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    </div>
                                </div>
                                <button className="w-full mt-4 text-primary font-semibold text-sm hover:text-primary/80">
                                    Manage Alerts
                                </button>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4">Recent Activity</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Application Accepted</p>
                                            <p className="text-xs text-gray-500">Guitar Lessons - 2 hours ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Job Completed</p>
                                            <p className="text-xs text-gray-500">Fan Repair - Yesterday</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tips */}
                            <div className="bg-gradient-to-br from-primary/10 to-green-100 rounded-xl p-6">
                                <h3 className="font-bold text-gray-900 mb-2">💡 Pro Tip</h3>
                                <p className="text-sm text-gray-700 mb-3">
                                    Complete your profile to get 3x more job recommendations!
                                </p>
                                <button className="text-primary font-semibold text-sm hover:text-primary/80">
                                    Complete Now →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JobSeekerDashboard;
                                            

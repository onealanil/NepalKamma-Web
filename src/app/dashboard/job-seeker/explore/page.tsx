"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LeftSideSeeker from "@/components/ui/LeftSideSeeker";
import { Job } from "@/types/job-seeker/home";


function ExplorePage() {
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
                    <LeftSideSeeker />
                    {/* Main Content */}
                    <div className="lg:col-span-6 py-6">
                        {/* Hero Section */}
                        <div className="mb-6">
                            {/* Search */}
                            <div className="mb-6">
                                <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search for Jobs near you..."
                                        className="flex-1 outline-none text-gray-700 bg-transparent"
                                    />
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
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

                                                    <p className="text-gray-600 mb-3 line-clamp-2">{job.description} adf</p>

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-1 text-gray-500">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            </svg>
                                                            <span className="text-sm">{job.location}</span>
                                                        </div>
                                                        <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors" onClick={()=> router.push(`/dashboard/job-seeker/job?id=${job._id}`)}>
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
                    </div>

                    {/* Right Sidebar - Filters */}
                    <div className="hidden lg:block lg:col-span-3 py-6">
                        <div className="sticky top-6 space-y-6">
                            {/* Filter Header */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-gray-900">Filters</h3>
                                    <button className="text-primary text-sm font-medium hover:text-primary/80">
                                        Clear All
                                    </button>
                                </div>
                            </div>

                            {/* Location Filter */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h4 className="font-semibold text-gray-900 mb-4">Distance</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                        <span>1 km</span>
                                        <span>15 km</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="15"
                                        defaultValue="5"
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                    />
                                    <div className="text-center">
                                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                                            Within 5 km
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h4 className="font-semibold text-gray-900 mb-4">Category</h4>
                                <div className="space-y-3">
                                    {['All Categories', 'Electrical', 'Teaching', 'Plumbing', 'Cleaning', 'Delivery', 'Repair'].map((category) => (
                                        <label key={category} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                defaultChecked={category === 'All Categories'}
                                                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                                            />
                                            <span className="ml-3 text-sm text-gray-700">{category}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h4 className="font-semibold text-gray-900 mb-4">Price Range</h4>
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <label className="block text-xs text-gray-500 mb-1">Min</label>
                                            <input
                                                type="number"
                                                placeholder="₹500"
                                                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-xs text-gray-500 mb-1">Max</label>
                                            <input
                                                type="number"
                                                placeholder="₹5000"
                                                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sort By */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h4 className="font-semibold text-gray-900 mb-4">Sort By</h4>
                                <div className="space-y-3">
                                    {[
                                        { label: 'Most Recent', value: 'recent' },
                                        { label: 'Price: Low to High', value: 'price_asc' },
                                        { label: 'Price: High to Low', value: 'price_desc' },
                                        { label: 'Highest Rating', value: 'rating' },
                                        { label: 'Distance', value: 'distance' }
                                    ].map((option) => (
                                        <label key={option.value} className="flex items-center">
                                            <input
                                                type="radio"
                                                name="sortBy"
                                                value={option.value}
                                                defaultChecked={option.value === 'recent'}
                                                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary focus:ring-2"
                                            />
                                            <span className="ml-3 text-sm text-gray-700">{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Urgency Filter */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h4 className="font-semibold text-gray-900 mb-4">Urgency</h4>
                                <div className="space-y-3">
                                    {[
                                        { label: 'High Priority', value: 'high', color: 'bg-red-100 text-red-600' },
                                        { label: 'Medium Priority', value: 'medium', color: 'bg-yellow-100 text-yellow-600' },
                                        { label: 'Low Priority', value: 'low', color: 'bg-green-100 text-green-600' }
                                    ].map((urgency) => (
                                        <label key={urgency.value} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                                            />
                                            <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${urgency.color}`}>
                                                {urgency.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Apply Filters Button */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <button className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Main Content  */}
            </div>
        </div>
    );
}

export default ExplorePage;

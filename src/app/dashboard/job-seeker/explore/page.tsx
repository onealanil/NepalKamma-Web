"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LeftSideSeeker from "@/components/ui/LeftSideSeeker";

import { useAllJobs } from "@/hooks/jobs/useAllJobs";
import { JobI } from "@/types/job";
import JobCardSeeker from "@/components/job/JobCardSeeker";
import Pagination from "@/components/ui/Pagination";


// Object { job: (2) [\u2026], totalPages: 1, totalJobs: 2, currentPage: 1 }
// \u200b
// currentPage: 1
// \u200b
// job: Array [ {\u2026}, {\u2026} ]
// \u200b\u200b
// 0: Object { _id: "6894116a05eed6f8c1231144", title: "Maths teacher needed at itahari", location: "Itahari, Nepal", \u2026 }
// \u200b\u200b\u200b
// __v: 0
// \u200b\u200b\u200b
// _id: "6894116a05eed6f8c1231144"
// \u200b\u200b\u200b
// address: Object { coordinates: (2) [\u2026], type: "Point" }
// \u200b\u200b\u200b
// assignedTo: null
// \u200b\u200b\u200b
// category: "education_training"
// \u200b\u200b\u200b
// createdAt: "2025-08-07T02:37:30.991Z"
// \u200b\u200b\u200b
// experiesIn: "2025-08-07T14:37:30.988Z"
// \u200b\u200b\u200b
// job_description: "<p>I will provide home service at any time I will provide home service at any time I will provide home service at any time I will provide home service at any time I will provide home service at any time I will provide home service at any time </p>"
// \u200b\u200b\u200b
// job_status: "Pending"
// \u200b\u200b\u200b
// location: "Itahari, Nepal"
// \u200b\u200b\u200b
// payment_method: Array [ "cash" ]
// \u200b\u200b\u200b
// phoneNumber: "9804077722"
// \u200b\u200b\u200b
// postedBy: Object { _id: "688746faaaa35c1c80ec3d00", username: "Emily Clarke", email: "23bhandarianil@gmail.com", \u2026 }
// \u200b\u200b\u200b
// price: 500
// \u200b\u200b\u200b
// priority: "Medium"
// \u200b\u200b\u200b
// rating: 0
// \u200b\u200b\u200b
// skills_required: Array [ "teaching" ]
// \u200b\u200b\u200b
// title: "Maths teacher needed at itahari"
// \u200b\u200b\u200b
// updatedAt: "2025-08-07T02:37:30.991Z"
// \u200b\u200b\u200b
// visibility: "public"
// \u200b\u200b\u200b
// <prototype>: Object { \u2026 }
// \u200b\u200b
// 1: Object { _id: "6894114005eed6f8c1231137", title: "Databases Teacher needed at biratchowk", location: "Biratchok, Koshi Province, Nepal", \u2026 }
// \u200b\u200b
// length: 2
// \u200b\u200b
// <prototype>: Array []
// \u200b
// totalJobs: 2
// \u200b
// totalPages: 1

function ExplorePage() {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    // Use pagination hook
    const {
        jobs,
        totalPages,
        totalJobs,
        isLoading,
        isError
    } = useAllJobs(currentPage, 5);

    const handleJobSelect = (job: JobI) => {
        // Navigate to job detail page
        router.push(`/dashboard/job-seeker/job/${job._id}`);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };


    const getEmptyMessage = () => {
        return {
            title: 'No jobs available',
            subtitle: 'Complete your profile to get job recommendations',
            icon: '🎯'
        };

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

                            {!isLoading && (
                                <>
                                    {isError ? (
                                        <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                                            <div className="text-4xl mb-4">⚠️</div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                                Failed to Load Jobs
                                            </h3>
                                            <p className="text-gray-600 mb-6">
                                                Something went wrong while fetching jobs. Please try again.
                                            </p>
                                            <button
                                                onClick={() => window.location.reload()}
                                                className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                                            >
                                                Try Again
                                            </button>
                                        </div>
                                    ) : totalJobs === 0 ? (
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
                                        <>
                                            {/* Jobs List */}
                                            <div className="space-y-4 mb-6">
                                                {jobs.map((job: JobI) => (
                                                    <JobCardSeeker
                                                        key={job._id}
                                                        data={job}
                                                        onSelect={handleJobSelect}
                                                    />
                                                ))}
                                            </div>

                                            {/* Pagination */}
                                            <Pagination
                                                currentPage={currentPage}
                                                totalPages={totalPages}
                                                totalJobs={totalJobs}
                                                onPageChange={handlePageChange}
                                                isLoading={isLoading}
                                            />
                                        </>
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

"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, LucideEqualApproximately } from 'lucide-react';
import LeftSideSeeker from '@/components/ui/LeftSideSeeker';
import { JobI } from '@/types/job';
import { useSavedJobs } from '@/hooks/jobs/useSavedJobs';
import JobCardSeeker from '@/components/job/JobCardSeeker';
import { useSavedJobsStore } from '@/store/savedJobsStore';
import RefreshingButton from '@/components/ui/RefreshingButton';

const JobCardLoader = () => (
    <div className="bg-white rounded-xl p-4 mb-4 shadow-sm animate-pulse">
        <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
        </div>
    </div>
);

export default function SavedJobs() {
    const router = useRouter();
    const {
        savedJobs,
        isLoading,
        error,
        fetchSavedJobs,
        clearError,
        savedJobsCount
    } = useSavedJobs();

    useEffect(() => {
        fetchSavedJobs();
    }, []);

    const handleJobSelect = (job: JobI) => {
        router.push(`/dashboard/job-seeker/job/${job._id}`);
    };

    const handleBackPress = () => {
        router.push('/dashboard/job-seeker');
    };

    const handleRetry = () => {
        clearError();
        fetchSavedJobs();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full max-w-md lg:max-w-7xl mx-auto px-4 pb-20">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Left Sidebar - Hidden on mobile, visible on desktop */}
                    <LeftSideSeeker />
                    
                    {/* Main Content */}
                    <div className="lg:col-span-6 py-6">
                        {/* Header */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <button
                                    onClick={handleBackPress}
                                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    <ChevronLeft size={24} />
                                    <span className="font-bold text-xl text-gray-900">
                                        Saved Jobs List
                                    </span>
                                </button>

                                {/* Debug/Refresh Button */}
                                <RefreshingButton
                                    handleRefresh={handleRetry}
                                    isRefreshing={isLoading}
                                    isLoading={isLoading}
                                />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="pb-20">
                            {isLoading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3, 4, 5].map((item) => (
                                        <JobCardLoader key={item} />
                                    ))}
                                </div>
                            ) : error ? (
                                // ✅ Error state
                                <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                                    <div className="text-4xl mb-4">⚠️</div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                        Failed to Load Saved Jobs
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        {error}
                                    </p>
                                    <button
                                        onClick={handleRetry}
                                        className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            ) : savedJobsCount === 0 ? (
                                // ✅ Empty state
                                <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                                    <div className="text-4xl mb-4 flex items-center justify-center">
                                        <LucideEqualApproximately size={48} color='red' />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                        No Saved Jobs Yet
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Start saving jobs you're interested in to see them here.
                                        You can save jobs by clicking the bookmark icon on any job card.
                                    </p>
                                    <button
                                        onClick={() => router.push('/dashboard/job-seeker/explore')}
                                        className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                                    >
                                        Explore Jobs
                                    </button>
                                </div>
                            ) : savedJobsCount > 0 && savedJobs.length === 0 ? (
                                // ⚠️ Mismatch state - count > 0 but no jobs loaded
                                <div className="bg-white rounded-xl p-8 text-center shadow-sm border-2 border-yellow-200">
                                    <div className="text-4xl mb-4">⚠️</div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                        Loading Saved Jobs...
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        You have {savedJobsCount} saved job{savedJobsCount > 1 ? 's' : ''}, but they're still loading.
                                        If this persists, try refreshing.
                                    </p>
                                    <div className="flex gap-3 justify-center">
                                        <button
                                            onClick={handleRetry}
                                            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                                        >
                                            Retry Loading
                                        </button>
                                        <button
                                            onClick={() => window.location.reload()}
                                            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                                        >
                                            Refresh Page
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // ✅ Success state with jobs
                                <div className="space-y-4">
                                    {savedJobs.map((job: JobI) => (
                                       <JobCardSeeker
                                            key={job._id}
                                            data={job}
                                            onSelect={handleJobSelect}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar - Hidden on mobile, visible on desktop */}
                    <div className="hidden lg:block lg:col-span-3 py-6">
                        <div className="sticky top-6 space-y-6">
                            {/* Quick Stats */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4">Saved Jobs</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Saved</span>
                                        <span className="font-semibold text-primary">{savedJobsCount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">High Priority</span>
                                        <span className="font-semibold text-red-600">
                                            {savedJobs.filter((job: JobI) => job.priority === 'High').length}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => router.push('/dashboard/job-seeker/explore')}
                                        className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                                    >
                                        Find More Jobs
                                    </button>
                                    <button
                                        onClick={() => router.push('/dashboard/job-seeker')}
                                        className="w-full bg-primary/10 text-primary py-3 rounded-lg font-semibold hover:bg-primary/20 transition-colors"
                                    >
                                        Dashboard
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

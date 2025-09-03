"use client";

import { useState } from "react";
import { useCompletedJobsProvider } from "@/hooks/jobs/useCompletedJobsProvider";
import JobCardCompletedProvider from "@/components/job/JobCardCompletedProvider";
import PayModal from "@/components/modals/PayModal";
import LeftSideProvider from "@/components/ui/LeftSideProvider";
import { JobI } from "@/types/job";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

const JobCardLoader = () => (
    <div className="bg-white rounded-xl p-6 mb-4 shadow-sm animate-pulse">
        <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
        </div>
    </div>
);

export default function CompletedJobPage() {
    const router = useRouter();
    const { jobs, isLoading, isError, mutate } = useCompletedJobsProvider();
    const [selectedJob, setSelectedJob] = useState<JobI | null>(null);
    const [isPayModalVisible, setIsPayModalVisible] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handlePayClick = (job: JobI) => {
        setSelectedJob(job);
        setIsPayModalVisible(true);
    };

    const handlePaymentComplete = () => {
        mutate();
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await mutate();
        } catch (error) {
            console.error('Failed to refresh jobs:', error);
        } finally {
            setIsRefreshing(false);
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full max-w-md lg:max-w-7xl mx-auto px-4 pb-20">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Left Sidebar */}
                    <LeftSideProvider />

                    {/* Main Content */}
                    <div className="lg:col-span-9 py-6">
                        {/* Header */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Completed Jobs</h1>
                                    <p className="text-gray-600 mt-1">
                                        Manage payments for your completed jobs
                                    </p>
                                </div>

                                {/* Refresh Button */}
                                <button
                                    onClick={handleRefresh}
                                    disabled={isRefreshing || isLoading}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                >
                                    <RefreshCw
                                        size={16}
                                        className={`text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`}
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        {isRefreshing ? 'Refreshing...' : 'Refresh'}
                                    </span>
                                </button>
                            </div>
                        </div>
                        {/* Info Alert for Completed Jobs */}
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2
v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-blue-700">
                                        Here you can view all completed jobs. Our online payment system is not yet integrated, So please pay the workers directly through your preferred payment method (but select offline payment), and also click Pay button and insert the total amount you paid to the worker for our record. So, your level will increase and you will get more benefits from us. We verify the payments from both sides (Job Provider and Worker) to ensure transparency and trust.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="min-h-[60vh]">
                            {isLoading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3, 4, 5].map((item) => (
                                        <JobCardLoader key={item} />
                                    ))}
                                </div>
                            ) : isError ? (
                                <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                                    <div className="text-4xl mb-4">⚠️</div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                        Failed to Load Jobs
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Something went wrong while fetching completed jobs.
                                    </p>
                                    <button
                                        onClick={() => mutate()}
                                        className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            ) : !jobs || jobs.length === 0 ? (
                                <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                                    <div className="text-4xl mb-4">📋</div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                        No Completed Jobs
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        You don&apos;t have any completed jobs yet. Once jobs are completed, they&apos;ll appear here for payment processing.
                                    </p>
                                    <button
                                        onClick={() => router.push('/dashboard/job-provider')}
                                        className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                                    >
                                        Go to Dashboard
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {jobs.map((job: JobI) => (
                                        <JobCardCompletedProvider
                                            key={job._id}
                                            job={job}
                                            onPayClick={handlePayClick}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Pay Modal */}
            <PayModal
                isVisible={isPayModalVisible}
                setIsVisible={setIsPayModalVisible}
                job={selectedJob}
                onPaymentComplete={handlePaymentComplete}
            />
        </div>
    );
}
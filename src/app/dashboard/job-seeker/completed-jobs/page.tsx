"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, RefreshCw } from 'lucide-react';
import LeftSideSeeker from '@/components/ui/LeftSideSeeker';
import { useGetPaymentSeeker } from '@/hooks/jobs/useGetPaymentSeeker';
import RequestPaymentModal from '@/components/modals/job-seeker/completed-jobs/RequestPaymentModal';
import { CompletedJob } from '@/types/job-provider/CompletedJob';
import PaymentModal from '@/components/modals/job-seeker/completed-jobs/PaymentModal';
import CompletedJobCard from '@/components/modals/job-seeker/completed-jobs/CompletedJobCard';


const CompletedJobLoader = () => (
    <div className="bg-white rounded-xl p-4 mb-4 shadow-sm animate-pulse">
        <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="flex gap-2 mt-3">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
            </div>
        </div>
    </div>
);


export default function CompletedJobs() {
    const router = useRouter();
    const [selectedJob, setSelectedJob] = useState<CompletedJob | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showRequestPaymentModal, setShowRequestPaymentModal] = useState(false);
    const { jobs, isLoading, mutate } = useGetPaymentSeeker();
    const [isRefreshing, setIsRefreshing] = useState(false);


    const handleViewPayment = (job: CompletedJob) => {
        setSelectedJob(job);
        setShowPaymentModal(true);
    };

    const handleRequestPayment = (job: CompletedJob) => {
        setSelectedJob(job);
        setShowRequestPaymentModal(true);
    };

    const handleBackPress = () => {
        router.push('/dashboard/job-seeker');
    };

    function onSuccess() {
        mutate();
    }

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

    const totalEarnings = jobs.reduce((sum: number, job: CompletedJob) => sum + job.amount, 0);
    const paidJobs = jobs.filter((job: CompletedJob) => job.paymentStatus === 'provider_paid').length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full max-w-md lg:max-w-7xl mx-auto px-4 pb-20">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Left Sidebar - Hidden on mobile, visible on desktop */}
                    <LeftSideSeeker />

                    {/* Main Content */}
                    <div className="lg:col-span-6 py-6">
                        <div className='flex flex-col lg:flex-row justify-between'>
                            {/* Header */}
                            <div className="mb-6">
                                <button
                                    onClick={handleBackPress}
                                    className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    <ChevronLeft size={24} />
                                    <span className="font-bold text-xl text-gray-900">
                                        Completed Jobs List
                                    </span>
                                </button>

                                <p className="text-gray-700 font-medium ml-8">
                                    Total jobs ({jobs.length})
                                </p>
                            </div>
                            <div>
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

                        {/* Content */}
                        <div className="pb-20">
                            {isLoading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3, 4, 5].map((item) => (
                                        <CompletedJobLoader key={item} />
                                    ))}
                                </div>
                            ) : (
                                <>
                                    {jobs.length === 0 ? (
                                        <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                                            <div className="text-4xl mb-4">📋</div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                                No Completed Jobs
                                            </h3>
                                            <p className="text-red-500 font-medium mb-4">
                                                Job&apos;s not completed yet!!
                                            </p>
                                            <button
                                                onClick={() => router.push('/dashboard/job-seeker/explore')}
                                                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                                            >
                                                Find Jobs
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {jobs.map((job: CompletedJob) => (
                                                <CompletedJobCard
                                                    key={job._id}
                                                    data={job}
                                                    onViewPayment={handleViewPayment}
                                                    onRequestPayment={handleRequestPayment}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar - Hidden on mobile, visible on desktop */}
                    <div className="hidden lg:block lg:col-span-3 py-6">
                        <div className="sticky top-6 space-y-6">
                            {/* Earnings Stats */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4">Earnings Summary</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Earned</span>
                                        <span className="font-bold text-green-600">Rs. {totalEarnings.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Completed Jobs</span>
                                        <span className="font-bold text-primary">{jobs.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Paid Jobs</span>
                                        <span className="font-bold text-green-600">{paidJobs}</span>
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

            {/* Payment Modal */}
            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                data={selectedJob}
            />

            {/* Request Payment Modal */}
            <RequestPaymentModal
                isOpen={showRequestPaymentModal}
                onClose={() => setShowRequestPaymentModal(false)}
                data={selectedJob}
                onSuccess={onSuccess}
            />
        </div>
    );
}

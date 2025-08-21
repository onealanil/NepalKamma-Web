"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Star } from 'lucide-react';
import LeftSideSeeker from '@/components/ui/LeftSideSeeker';
import { usePaginatedReviews } from '@/hooks/review/useReviews';
import { useAuthStore } from '@/store/authStore';
import ReviewCard from '@/components/review/ReviewCard';
import Loader from '@/components/global/Loader';
import ReviewPagination from '@/components/review/ReviewPagination';
import RefreshingButton from '@/components/ui/RefreshingButton';


export default function MyReviewPage() {
    const router = useRouter();

    // Get current logged-in user for verification checks
    const { user: currentUser } = useAuthStore();

    // Fetch paginated reviews for the job provider
    const {
        reviews: reviewData,
        pagination,
        averageRating,
        isLoading: isLoadingReviews,
        currentPage,
        setCurrentPage,
        mutate: mutateReviews,
    } = usePaginatedReviews(currentUser?._id);


    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);



    const handleBackPress = () => {
        router.push('/dashboard/job-seeker');
    };

    if (isLoadingReviews || !currentUser || !currentUser._id) {
        return <Loader />
    }

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await mutateReviews();
        } catch (error) {
            console.error("Failed to refresh jobs:", error);
        } finally {
            setIsRefreshing(false);
        }
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
                            <button
                                onClick={handleBackPress}
                                className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ChevronLeft size={24} />
                                <span className="font-bold text-xl text-gray-900">
                                    My Reviews
                                </span>
                            </button>
                            <div className="flex items-center justify-end">
                                <RefreshingButton
                                    handleRefresh={handleRefresh}
                                    isRefreshing={isRefreshing}
                                    isLoading={isLoadingReviews}
                                />
                            </div>
                        </div>

                        {/* Loading State */}
                        {isLoadingReviews && (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            </div>
                        )}

                        {/* Content */}
                        {!isLoadingReviews && (
                            <div className="space-y-6">
                                {/* Stats */}
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-gray-600 font-medium text-sm">Total Reviews:</p>
                                            <p className="text-primary font-bold text-2xl">{reviewData?.length || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 font-medium text-sm">Average Rating:</p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-primary font-bold text-2xl">
                                                    {(averageRating && averageRating.toFixed(1)) || 0}
                                                </p>
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={16}
                                                            className={`${i < Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-gray-500 text-sm">out of 5</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Reviews List */}
                                <div className="pb-20">
                                    {reviewData.length === 0 ? (
                                        <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                                            <div className="text-4xl mb-4">⭐</div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                                No Reviews Yet
                                            </h3>
                                            <p className="text-red-500 font-medium mb-4">
                                                No review found
                                            </p>
                                            <button
                                                onClick={() => router.push('/dashboard/job-seeker/explore')}
                                                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                                            >
                                                Find Jobs to Get Reviews
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="space-y-4">
                                                {reviewData.map((review) => (
                                                    <ReviewCard key={review._id} data={review} />
                                                ))}
                                                {/* Pagination */}
                                                <ReviewPagination
                                                    pagination={pagination}
                                                    currentPage={currentPage}
                                                    onPageChange={setCurrentPage}
                                                    isLoading={isLoadingReviews}
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar - Hidden on mobile, visible on desktop */}
                    <div className="hidden lg:block lg:col-span-3 py-6">
                        <div className="sticky top-6 space-y-6">
                            {/* Rating Breakdown */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4">Rating Breakdown</h3>
                                <div className="space-y-3">
                                    {[5, 4, 3, 2, 1].map((rating) => {
                                        const count = reviewData.filter(r => r.rating === rating).length;
                                        const percentage = reviewData.length > 0 ? (count / reviewData.length) * 100 : 0;

                                        return (
                                            <div key={rating} className="flex items-center gap-3">
                                                <div className="flex items-center gap-1 w-12">
                                                    <span className="text-sm">{rating}</span>
                                                    <Star size={12} className="text-yellow-400 fill-current" />
                                                </div>
                                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm text-gray-600 w-8">{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => router.push('/dashboard/job-seeker/completed-jobs')}
                                        className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                                    >
                                        View Completed Jobs
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
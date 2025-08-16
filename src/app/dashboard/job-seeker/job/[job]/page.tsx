"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { X, MapPin, Star, Bookmark, BookmarkCheck, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import LeftSideSeeker from '@/components/ui/LeftSideSeeker';
import SafeHTML from '@/components/global/SafeHTML';
import Image from 'next/image';
import { useSingleJob } from '@/hooks/jobs/useSingleJob';
import { applyToJob } from '@/lib/job/job-api';
import { useSavedJobs, useJobSaveStatus } from "@/hooks/jobs/useSavedJobs";
import { ErrorToast, SuccessToast } from '@/components/ui/Toast';
import ReviewCard from '@/components/review/ReviewCard';
import ReviewPagination from '@/components/review/ReviewPagination';
import { useAuthStore } from '@/store/authStore';
import { usePaginatedReviews } from '@/hooks/review/useReviews';
import { createReview } from '@/lib/review/review-api';


export default function SingleJobPage() {
    const router = useRouter();
    const params = useParams();
    const jobId = params.job as string;
    const {user: loggedInUser} = useAuthStore();
    const { job: jobData, isLoading, isError, mutate } = useSingleJob(jobId);

    // Fetch paginated reviews for the job provider
    const {
        reviews: reviewData,
        pagination,
        averageRating,
        isLoading: isLoadingReviews,
        currentPage,
        setCurrentPage,
        mutate: mutateReviews
    } = usePaginatedReviews(jobData?.postedBy?._id);

    // Check if current user can review this job provider
    const canReviewProvider = (
        loggedInUser?.can_review &&
        jobData?.postedBy?._id &&
        loggedInUser._id !== jobData.postedBy._id && // Prevent self-review
        loggedInUser.can_review?.some((reviewItem) => (reviewItem as { user: string; _id: string }).user === jobData.postedBy._id)
    ) || false;
    
    // Use saved jobs store instead of local state
    const { isSaved: isPostSaved } = useJobSaveStatus(jobId);
    const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
    const [isApplying, setIsApplying] = useState(false);
    const [isRating, setIsRating] = useState(false);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!jobId) {
            router.push('/dashboard/job-seeker/explore');
            return;
        }
    }, [jobId, router]);



    const handleContactProvider = () => {
        if (jobData?.postedBy?._id) {
            router.push(`/dashboard/job-seeker/profile/user/${jobData.postedBy._id}`);
        }
    };

    // Use saved jobs store for save/unsave functionality
    const { toggleSaveJob } = useSavedJobs();

    const saveJobHandler = async () => {
        if (!jobId || !jobData) return;

        const success = await toggleSaveJob(jobData);
        if (success) {
            if (isPostSaved) {
                SuccessToast("Job removed from saved list!");
            } else {
                SuccessToast("Job saved successfully!");
            }
        } else {
            ErrorToast("Failed to update saved jobs. Please try again.");
        }
    };

    // Keep the same handler for both save and unsave
    const unsaveJobHandler = saveJobHandler;

    const applyJobHandler = async () => {
        if (!jobId) return;

        setIsApplying(true);
        try {
            const response = await applyToJob(jobId);
            if (response.success) {
                SuccessToast("Application submitted successfully!");
                // Optionally redirect or update UI
            } else {
                ErrorToast("Failed to apply to job. Please try again.");
            }
        } catch (error) {
            ErrorToast("Failed to apply to job. Please try again.");
        } finally {
            setIsApplying(false);
        }
    };

    const handleReviewSubmit = async () => {
        // Validate rating
        if (!rating || rating < 1 || rating > 5) {
            ErrorToast("Please select a rating (1-5 stars)");
            return;
        }

        // Validate review text
        if (!review.trim()) {
            ErrorToast("Please write a review comment");
            return;
        }

        // Validate user data
        if (!loggedInUser?._id || !jobData?.postedBy?._id) {
            ErrorToast("Unable to submit review. Please try again.");
            return;
        }

        setIsSubmitting(true);
        try {
            const reviewData = {
                reviewedBy: loggedInUser._id,
                reviewedTo: jobData.postedBy._id,
                review: review.trim(),
                rating: rating
            };

            const response = await createReview(reviewData);

            if (response.success) {
                SuccessToast("Review submitted successfully!");
                setIsRating(false);
                setRating(0);
                setReview('');
                // Refresh reviews to show the new review
                mutateReviews();
            } else {
                ErrorToast(response.error || "Failed to submit review");
            }
        } catch (error) {
            ErrorToast("Failed to submit review. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
                        <div className="bg-white rounded-xl p-6 space-y-4">
                            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                            <div className="h-32 bg-gray-300 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isError || (!isLoading && !jobData)) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {isError ? 'Failed to Load Job' : 'Job Not Found'}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {isError
                            ? 'There was an error loading the job details. Please try again.'
                            : 'The job you are looking for does not exist or has been removed.'
                        }
                    </p>
                    <div className="space-x-4">
                        <button
                            onClick={() => mutate()}
                            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => router.push('/dashboard/job-seeker/explore')}
                            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                        >
                            Back to Explore
                        </button>
                    </div>
                </div>
            </div>
        );
    }


    if (jobData?.visibility === 'private') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Private Job
                    </h2>
                    <p className="text-gray-600 mb-6">
                        This job is private and can only be viewed by the job seeker.


                    </p>
                    <button
                        onClick={() => router.push('/dashboard/job-seeker/explore')}
                        className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                    >
                        Back to Explore
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Sidebar */}
                    <div className="hidden lg:block lg:col-span-3">
                        <LeftSideSeeker />
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-6 py-6">
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="p-6 space-y-6">
                                {/* Job Title */}
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{jobData.title}</h1>
                                </div>

                                {/* Provider Profile */}
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={handleContactProvider}
                                        className="relative"
                                    >
                                        <div className="relative">
                                            {jobData.postedBy?.profilePic?.url ? (
                                                <Image
                                                    src={jobData.postedBy.profilePic.url}
                                                    alt={jobData.postedBy.username}
                                                    width={40}
                                                    height={40}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                                    <span className="text-gray-600 text-sm">N/A</span>
                                                </div>
                                            )}
                                            <div
                                                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${jobData.postedBy?.onlineStatus ? 'bg-green-500' : 'bg-red-500'
                                                    }`}
                                            />
                                        </div>
                                    </button>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 w-[70%]">
                                                <h3 className="font-bold text-gray-900">{jobData.postedBy?.username}</h3>
                                                {canReviewProvider && (
                                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                                        Can Review
                                                    </span>
                                                )}
                                            </div>
                                            {isPostSaved ? (
                                                <button onClick={unsaveJobHandler} className="w-[30%] mt-2">
                                                    <BookmarkCheck size={20} className="text-primary" />
                                                </button>
                                            ) : (
                                                <button onClick={saveJobHandler} className="w-[30%] mt-2">
                                                    <Bookmark size={20} className="text-primary" />
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star
                                                size={15}
                                                className={`${averageRating > 0 ? 'text-yellow-500 fill-current' : 'text-gray-400'}`}
                                            />
                                            <span className="font-bold text-gray-900">
                                                {isLoadingReviews ? (
                                                    <span className="text-primary">Loading...</span>
                                                ) : (
                                                    averageRating?.toFixed(1) || '0.0'
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* category start  */}
                                <div className="flex gap-x-3 lg:hidden">
                                    <span className="text-black font-bold ">Category:</span>
                                    <span className="font-medium">{jobData.category}</span>
                                </div>

                                {/* category end  */}

                                {/* About this Job */}
                                <div className="space-y-4">
                                    <h2 className="text-lg font-bold text-gray-900">About this Job</h2>
                                    <div className="prose prose-sm max-w-none">
                                        <SafeHTML html={jobData.job_description} />
                                    </div>
                                </div>

                                {/* Skills Required */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-gray-900">Skills Required</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {jobData.skills_required?.map((skill: string, index: number) => (
                                            <span
                                                key={index}
                                                className="border border-color2 text-gray-800 px-3 py-1 rounded-md text-sm font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Payment */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-gray-900">Payment</h3>
                                    <p className="text-gray-700">
                                        Payment Starts from Rs.{' '}
                                        <span className="font-bold text-gray-900">₹{jobData.price.toLocaleString()}</span>
                                    </p>
                                    <p className="text-red-500 text-sm font-semibold leading-relaxed">
                                        Payment varies based on experience, qualifications, and project
                                        scope. Contact the job provider for details before applying. Thank
                                        you for your proactive approach.
                                    </p>
                                </div>

                                {/* Payment Method */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-gray-900">Payment Method</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {jobData.payment_method?.map((method: string, index: number) => (
                                            <span
                                                key={index}
                                                className="border border-primary text-gray-800 px-3 py-1 rounded-md text-sm font-medium"
                                            >
                                                {method}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* location start */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-gray-900">Location</h3>
                                    <span className="font-medium">{jobData.location}</span>
                                </div>
                                {/* location end */}

                                {/* priority start  */}
                                <div className="lg:hidden flex gap-x-3">
                                    <span className="font-bold text-black">Priority:</span>
                                    <span className={`font-medium ${jobData.priority === 'Urgent' ? 'text-red-600' :
                                        jobData.priority === 'Medium' ? 'text-yellow-600' :
                                            'text-green-600'
                                        }`}>
                                        {jobData.priority}
                                    </span>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-gray-900">For more Details</h3>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button
                                            onClick={applyJobHandler}
                                            disabled={isApplying}
                                            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
                                        >
                                            {isApplying ? 'Applying...' : 'Apply Now'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                const lat = jobData?.address?.coordinates?.[1];
                                                const lng = jobData?.address?.coordinates?.[0];
                                                if (lat && lng) {
                                                    router.push(`/dashboard/job-seeker/map?lat=${lat}&lng=${lng}`);
                                                } else {
                                                    alert('Job location not available');
                                                }
                                            }}
                                            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                                        >
                                            View on Map
                                        </button>
                                    </div>
                                </div>

                                {/* Job Expiry */}
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-700 font-semibold">Job will expire in</span>
                                    <span className="text-red-500 font-bold text-lg">
                                        {formatDistanceToNow(new Date(jobData.experiesIn))}
                                    </span>
                                </div>

                                {/* Reviews Section */}
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-gray-900">Seller Reviews</h2>
                                    <hr className="border-gray-200" />

                                    {/* Rating Input */}
                                    {isRating && canReviewProvider && (
                                        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                                            <div className="flex gap-4">
                                                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                                    <Image
                                                        src={loggedInUser?.profilePic?.url || "https://picsum.photos/100/100?random=6"}
                                                        alt="Your profile"
                                                        width={48}
                                                        height={48}
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 space-y-3">
                                                    <h4 className="font-bold text-gray-900">{loggedInUser?.username || "Your Name"}</h4>
                                                    <p className="text-gray-600">{loggedInUser?.location || "Your Location"}</p>

                                                    {/* Star Rating */}
                                                    <div className="space-y-2">
                                                        <div className="flex gap-1">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <button
                                                                    key={star}
                                                                    onClick={() => setRating(star)}
                                                                    className={`${star <= rating
                                                                        ? 'text-yellow-500'
                                                                        : 'text-primary'
                                                                        } hover:text-yellow-500 transition-colors`}
                                                                >
                                                                    <Star
                                                                        size={20}
                                                                        fill={star <= rating ? 'currentColor' : 'none'}
                                                                    />
                                                                </button>
                                                            ))}
                                                        </div>
                                                        {rating > 0 && (
                                                            <p className="text-sm text-gray-600">
                                                                {rating} star{rating !== 1 ? 's' : ''} selected
                                                            </p>
                                                        )}
                                                    </div>

                                                    <textarea
                                                        placeholder="Write your review..."
                                                        value={review}
                                                        onChange={(e) => setReview(e.target.value)}
                                                        className="w-full p-3 border border-primary rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                    />

                                                    <button
                                                        onClick={handleReviewSubmit}
                                                        disabled={isSubmitting || !rating || !review.trim()}
                                                        className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title={!rating ? 'Please select a rating' : !review.trim() ? 'Please write a review' : ''}
                                                    >
                                                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {!isRating && (
                                        <div className="space-y-3">
                                            {canReviewProvider ? (
                                                <button
                                                    onClick={() => setIsRating(true)}
                                                    className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                                                >
                                                    Write a Review
                                                </button>
                                            ) : (
                                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-5 h-5 text-yellow-600 mt-0.5">⚠️</div>
                                                        <div>
                                                            <h4 className="font-semibold text-yellow-800 mb-1">Review Not Available</h4>
                                                            <p className="text-yellow-700 text-sm">
                                                                You can only review job providers you have worked with before.
                                                                Complete a job with this provider to unlock the review feature.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <hr className="border-gray-200" />

                                    {/* Reviews List */}
                                    <div className="space-y-4">
                                        {isLoadingReviews ? (
                                            <p className="text-primary">Loading...</p>
                                        ) : (
                                            <p className="text-gray-700">
                                                Total {pagination?.totalReviews || 0} Reviews
                                            </p>
                                        )}

                                        {!isLoadingReviews && reviewData.length > 0 && (
                                            <>
                                                <div className="space-y-4">
                                                    {reviewData.map((reviewItem) => (
                                                        <ReviewCard key={reviewItem._id} data={reviewItem} />
                                                    ))}
                                                </div>

                                                {/* Pagination */}
                                                <ReviewPagination
                                                    pagination={pagination}
                                                    currentPage={currentPage}
                                                    onPageChange={setCurrentPage}
                                                    isLoading={isLoadingReviews}
                                                />
                                            </>
                                        )}

                                        {!isLoadingReviews && reviewData.length === 0 && (
                                            <p className="text-red-500 font-bold">No review found</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="hidden lg:block lg:col-span-3 py-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm sticky top-6">
                            <h3 className="font-bold text-gray-900 mb-4">Job Details</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Category:</span>
                                    <span className="font-medium">{jobData.category}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Budget:</span>
                                    <span className="font-medium">₹{jobData.price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 mr-5">Location:</span>
                                    <span className="font-medium">{jobData.location}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Expires:</span>
                                    <span className="font-medium text-red-500">
                                        {formatDistanceToNow(new Date(jobData.experiesIn), { addSuffix: true })}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Status:</span>
                                    <span className={`font-medium ${jobData.job_status === 'Pending' ? 'text-yellow-600' :
                                        jobData.job_status === 'In_Progress' ? 'text-blue-600' :
                                            jobData.job_status === 'Completed' ? 'text-green-600' :
                                                'text-gray-600'
                                        }`}>
                                        {jobData.job_status}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Priority:</span>
                                    <span className={`font-medium ${jobData.priority === 'Urgent' ? 'text-red-600' :
                                        jobData.priority === 'Medium' ? 'text-yellow-600' :
                                            'text-green-600'
                                        }`}>
                                        {jobData.priority}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Rating:</span>
                                    <div className="flex items-center gap-1">
                                        <Star size={16} className="text-yellow-500 fill-current" />
                                        <span className="font-medium">{averageRating.toFixed(1)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                <button
                                    onClick={saveJobHandler}
                                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-colors ${isPostSaved
                                        ? 'bg-primary text-white hover:bg-primary/90'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {isPostSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                                    {isPostSaved ? 'Saved' : 'Save Job'}
                                </button>
                                <button
                                    onClick={handleContactProvider}
                                    className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                                >
                                    <User size={20} />
                                    Contact Provider
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Location Modal */}
            {isLocationModalVisible && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Job Location</h3>
                            <button
                                onClick={() => setIsLocationModalVisible(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} className="text-gray-600" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <MapPin size={20} className="text-primary" />
                                <span className="text-gray-700">{jobData.location}</span>
                            </div>
                            <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                                <p className="text-gray-500">Map integration coming soon</p>
                            </div>
                            <p className="text-sm text-gray-600">
                                This is the job location. Exact address will be shared after application approval.
                            </p>
                            <button
                                onClick={() => setIsLocationModalVisible(false)}
                                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

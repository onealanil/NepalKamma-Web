
"use client";

import { useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, X, MapPin, Star, Send, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import LeftSideProvider from '@/components/ui/LeftSideProvider';
import SafeHTML from '@/components/global/SafeHTML';
import Image from 'next/image';
import { useSingleGig } from '@/hooks/gigs/useSingleGig';
import { useAuthStore } from '@/store/authStore';
import ReviewPagination from '@/components/review/ReviewPagination';
import { usePaginatedReviews } from '@/hooks/review/useReviews';
import ReviewCard from '@/components/review/ReviewCard';
import { ErrorToast, SuccessToast } from '@/components/ui/Toast';
import { createReview } from '@/lib/review/review-api';
import Link from 'next/link';
import logger from '@/utils/logger';
import { useMessageStore } from '@/store/messageStore';
import { CreateConversationData, CreateMessageData } from '@/types/message';

const GigDetailPage = () => {
    // State management for all features
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [isRating, setIsRating] = useState(false);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCreatingConversation, setIsCreatingConversation] = useState(false);

    // Navigation using Next.js router
    const router = useRouter();
    const params = useParams();
    const gigId = params.gig as string;


    const { user: loggedInUser } = useAuthStore();
    // Fetch gig data using the hook
    const { gig: gigData, mutate, isLoading, isError } = useSingleGig(gigId);

    // Message store for handling conversations and messages
    const {
        createConversationAction,
        createMessageAction,
        error: messageError,
        clearError: clearMessageError
    } = useMessageStore();

    // Fetch paginated reviews for the job provider
    const {
        reviews: reviewData,
        pagination,
        averageRating,
        isLoading: isLoadingReviews,
        currentPage,
        setCurrentPage,
        mutate: mutateReviews,
    } = usePaginatedReviews(gigData?.postedBy?._id);


    // Check if current user can review this job provider
    const canReviewProvider =
        (loggedInUser?.can_review &&
            gigData?.postedBy?._id &&
            loggedInUser._id !== gigData.postedBy._id && // Prevent self-review
            loggedInUser.can_review?.some(
                (reviewItem) =>
                    (reviewItem as { user: string; _id: string }).user ===
                    gigData?.postedBy?._id
            )) ||
        false;

    // Check if current user is verified
    const isCurrentUserVerified = loggedInUser?.isDocumentVerified === "verified";

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
        if (!loggedInUser?._id || !gigData?.postedBy?._id) {
            ErrorToast("Unable to submit review. Please try again.");
            return;
        }

        setIsSubmitting(true);
        try {
            const reviewData = {
                reviewedBy: loggedInUser._id,
                reviewedTo: gigData.postedBy._id,
                review: review.trim(),
                rating: rating,
            };

            const response = await createReview(reviewData);

            if (response.success) {
                SuccessToast("Review submitted successfully!");
                setIsRating(false);
                setRating(0);
                setReview("");
                // Refresh reviews to show the new review
                mutateReviews();
                mutate();
            } else {
                ErrorToast(response.error || "Failed to submit review");
            }
        } catch (error) {
            ErrorToast("Failed to submit review. Please try again.");
            logger.error(`Failed to submit review. ${error}`)
        } finally {
            setIsSubmitting(false);
        }
    };

    // Send message handler function
    const sendMessageHandler = useCallback(
        async (conversationId: string) => {
            if (!gigData?.title || !loggedInUser?.username || !gigData?.postedBy?._id) {
                ErrorToast("Missing required information to send message");
                return;
            }

            const messageData: CreateMessageData = {
                conversationId,
                msg: `Hello, I am interested in hiring you for your gig "${gigData.title}". Can we discuss the details? My username is ${loggedInUser.username}.`,
                recipientId: gigData.postedBy._id,
            };

            try {
                const message = await createMessageAction(messageData);
                if (message) {
                    SuccessToast("Message sent successfully!");
                    // Navigate to chat page
                    router.push(`/dashboard/job-provider/chat/${conversationId}`);
                } else {
                    ErrorToast(messageError || "Failed to send message");
                }
            } catch (error) {
                ErrorToast("Failed to send message. Please try again.");
                logger.error("Send message error:", error);
            } finally {
                setIsCreatingConversation(false);
            }
        },
        [gigData, loggedInUser, createMessageAction, messageError, router]
    );

    // Create conversation handler
    const createConversationHandler = useCallback(async () => {
        if (!loggedInUser?._id || !gigData?.postedBy?._id) {
            ErrorToast("Missing user information");
            return;
        }

        if (loggedInUser._id === gigData.postedBy._id) {
            ErrorToast("You cannot message yourself");
            return;
        }

        setIsCreatingConversation(true);
        clearMessageError();

        const conversationData: CreateConversationData = {
            senderId: loggedInUser._id,
            receiverId: gigData.postedBy._id,
        };

        try {
            const conversation = await createConversationAction(conversationData);
            if (conversation) {
                await sendMessageHandler(conversation._id);
            } else {
                ErrorToast(messageError || "Failed to create conversation");
                setIsCreatingConversation(false);
            }
        } catch (error) {
            ErrorToast("Failed to create conversation. Please try again.");
            logger.error("Create conversation error:", error);
            setIsCreatingConversation(false);
        }
    }, [loggedInUser, gigData, createConversationAction, sendMessageHandler, messageError, clearMessageError]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
                        <div className="bg-white rounded-xl p-6 space-y-4">
                            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                            <div className="h-64 bg-gray-300 rounded"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isError || (!isLoading && !gigData)) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {isError ? 'Error Loading Gig' : 'Gig Not Found'}
                    </h2>
                    <p className="text-gray-600 mb-4">
                        {isError
                            ? 'There was an error loading the gig details. Please try again.'
                            : 'The gig you are looking for does not exist or has been removed.'
                        }
                    </p>
                    <button
                        onClick={() => router.push('/dashboard/job-provider/explore')}
                        className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                    >
                        Back to Explore
                    </button>
                </div>
            </div>
        );
    }

    if (gigData?.visibility === "private") {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Private Job</h2>
                    <p className="text-gray-600 mb-6">
                        This job is private and can only be viewed by the job seeker.
                    </p>
                    <button
                        onClick={() => router.push("/dashboard/job-provider/explore")}
                        className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                    >
                        Back to Explore
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Sidebar */}
                    <div className="hidden lg:block lg:col-span-3">
                        <LeftSideProvider />
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-6 py-6">
                        {/* Verification Notice for unverified users */}
                        {!isCurrentUserVerified && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                                <div className="flex items-start gap-2">
                                    <div className="w-5 h-5 text-yellow-600 mt-0.5">⚠️</div>
                                    <div>
                                        <h4 className="font-semibold text-yellow-800 text-sm sm:text-base">
                                            Verification Required
                                        </h4>
                                        <p className="text-yellow-700 text-xs sm:text-sm mt-1">
                                            Verify your document to access messaging, calling, saving, reporting and
                                            location features.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="p-6 space-y-6">
                                {/* Gig Title */}
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">I will do {gigData?.title}</h1>
                                </div>

                                {/* Provider Profile */}
                                <div className="flex items-center gap-4">
                                    {
                                        gigData?.postedBy && gigData?.postedBy._id && (
                                            <Link
                                                href={`/dashboard/job-provider/profile/user/${gigData.postedBy._id}`}
                                                className='relative'
                                            >
                                                <div className="relative">
                                                    {gigData.postedBy?.profilePic?.url ? (
                                                        <Image
                                                            src={gigData.postedBy.profilePic.url}
                                                            alt={gigData.postedBy.username}
                                                            width={40}
                                                            height={40}
                                                            className="w-12 h-12 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full flex items-center justify-center">
                                                            <span className="text-gray-600 text-sm">N/A</span>
                                                        </div>
                                                    )}
                                                    <div
                                                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${gigData.postedBy?.onlineStatus ? 'bg-green-500' : 'bg-red-500'
                                                            }`}
                                                    />
                                                </div>
                                            </Link>
                                        )
                                    }

                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-gray-900">{gigData?.postedBy?.username}</h3>
                                            {canReviewProvider && (
                                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                                    Can Review
                                                </span>
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
                                                    averageRating?.toFixed(1) || "0.0"
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Image Gallery */}
                                {gigData && gigData.images && gigData.images.length > 0 && (
                                    <div className="space-y-4">
                                        <div className="relative h-45 bg-gray-100 rounded-lg overflow-hidden">
                                            <Image
                                                src={gigData.images[currentImageIndex]?.url || ''}
                                                alt={`Gig image ${currentImageIndex + 1}`}
                                                width={600}
                                                height={300}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                            {gigData.images.length > 1 && (
                                                <>
                                                    <button
                                                        onClick={() => setCurrentImageIndex(prev =>
                                                            prev === 0 ? gigData.images!.length - 1 : prev - 1
                                                        )}
                                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                                                    >
                                                        <ChevronLeft size={20} />
                                                    </button>
                                                    <button
                                                        onClick={() => setCurrentImageIndex(prev =>
                                                            prev === gigData.images!.length - 1 ? 0 : prev + 1
                                                        )}
                                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                                                    >
                                                        <ChevronRight size={20} />
                                                    </button>
                                                </>
                                            )}
                                        <div className="text-center">
                                            <span className="text-sm text-gray-600">
                                                Banner - {currentImageIndex + 1} of {gigData.images.length}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* About this gig */}
                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold text-gray-900">About this gig</h2>
                                    <div className="prose prose-sm max-w-none">
                                        <SafeHTML html={gigData?.gig_description || ''} />
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-gray-900">Skills</h3>
                                    {gigData?.postedBy?.skills && gigData.postedBy.skills.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {gigData.postedBy.skills.map((skill: string, index: number) => (
                                                <span
                                                    key={index}
                                                    className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm font-medium"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-red-500 font-bold">No Skills Added</p>
                                    )}
                                </div>

                                {/* Pricing */}
                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold text-gray-900">Pricing</h2>
                                    <p className="text-gray-700">
                                        I will start from Rs.{' '}
                                        <span className="font-bold text-gray-900">₹{gigData?.price}</span>{' '}
                                        for this gig.
                                    </p>
                                    <p className="text-red-500 text-sm font-semibold leading-relaxed">
                                        Please be aware that pricing may vary depending on the complexity
                                        and scale of the job. However, we believe in transparent pricing and
                                        ensuring that you receive the best value for your investment.
                                    </p>

                                    <h1 className='text-xl font-bold text-gray-900'>Category</h1>
                                    <p>
                                        {gigData?.category}
                                    </p>
                                    <h3 className="text-xl font-bold text-gray-900 pt-4">For more Details</h3>
                                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                                        <button
                                            onClick={createConversationHandler}
                                            disabled={isCreatingConversation || !isCurrentUserVerified || loggedInUser?._id === gigData?.postedBy?._id}
                                            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 hover:bg-green-700 flex items-center justify-center gap-2"
                                        >
                                            <MessageCircle size={20} />
                                            {isCreatingConversation ? "Sending..." : "Contact Me"}
                                        </button>

                                        {gigData?.postedBy?._id && (
                                            <Link
                                                href={`/dashboard/job-provider/profile/user/${gigData.postedBy._id}`}
                                                className="bg-primary items-center justify-center flex disabled:opacity-50 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                                                aria-disabled={!isCurrentUserVerified}
                                            >
                                                View Profile
                                            </Link>
                                        )}

                                        <button
                                            onClick={() => setShowLocationModal(true)}
                                            disabled={!isCurrentUserVerified}
                                            className="bg-primary disabled:opacity-50 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                                        >
                                            Get My Location
                                        </button>
                                    </div>
                                </div>

                                {/* Reviews Section */}
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-gray-900">Reviews</h2>
                                    <hr className="border-gray-200" />



                                    {/* Rating Input */}
                                    {isRating && canReviewProvider && (
                                        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                                            <div className="flex gap-4">
                                                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                                    <Image
                                                        src={
                                                            loggedInUser?.profilePic?.url ||
                                                            "https://picsum.photos/100/100?random=6"
                                                        }
                                                        alt="Your profile"
                                                        width={48}
                                                        height={48}
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 space-y-3">
                                                    <h4 className="font-bold text-gray-900">
                                                        {loggedInUser?.username || "Your Name"}
                                                    </h4>
                                                    <p className="text-gray-600">
                                                        {loggedInUser?.location || "Your Location"}
                                                    </p>

                                                    {/* Star Rating */}
                                                    <div className="space-y-2">
                                                        <div className="flex gap-1">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <button
                                                                    key={star}
                                                                    onClick={() => setRating(star)}
                                                                    className={`${star <= rating
                                                                        ? "text-yellow-500"
                                                                        : "text-primary"
                                                                        } hover:text-yellow-500 transition-colors`}
                                                                >
                                                                    <Star
                                                                        size={20}
                                                                        fill={
                                                                            star <= rating ? "currentColor" : "none"
                                                                        }
                                                                    />
                                                                </button>
                                                            ))}
                                                        </div>
                                                        {rating > 0 && (
                                                            <p className="text-sm text-gray-600">
                                                                {rating} star{rating !== 1 ? "s" : ""} selected
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
                                                        title={
                                                            !rating
                                                                ? "Please select a rating"
                                                                : !review.trim()
                                                                    ? "Please write a review"
                                                                    : ""
                                                        }
                                                    >
                                                        {isSubmitting ? "Submitting..." : "Submit Review"}
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
                                                        <div className="w-5 h-5 text-yellow-600 mt-0.5">
                                                            ⚠️
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-yellow-800 mb-1">
                                                                Review Not Available
                                                            </h4>
                                                            <p className="text-yellow-700 text-sm">
                                                                You can only review job seekers you have
                                                                worked with before. Complete a job with this
                                                                seeker to unlock the review feature.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <hr className="border-gray-200" />

                                    {/* Reviews List */}
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
                                                        <ReviewCard
                                                            key={reviewItem._id}
                                                            data={reviewItem}
                                                        />
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
                            <h3 className="font-bold text-gray-900 mb-4">Gig Details</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Category:</span>
                                    <span className="font-medium">{gigData?.category}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Starting Price:</span>
                                    <span className="font-medium">₹{gigData?.price}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Provider:</span>
                                    <span className="font-medium">{gigData?.postedBy?.username}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Posted:</span>
                                    <span className="font-medium">
                                        {formatDistanceToNow(new Date(gigData?.createdAt as Date), { addSuffix: true })}
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
                                    onClick={createConversationHandler}
                                    disabled={isCreatingConversation || !isCurrentUserVerified || loggedInUser?._id === gigData?.postedBy?._id}
                                    className="w-full disabled:opacity-50 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <MessageCircle size={20} />
                                    {isCreatingConversation ? "Sending Message..." : "Contact Seller"}
                                </button>

                                {gigData?.postedBy?._id && (
                                    <Link
                                        href={`/dashboard/job-provider/profile/user/${gigData.postedBy._id}`}
                                        className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Send size={20} />
                                        View Profile
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Location Modal */}
            {showLocationModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Provider Location</h3>
                            <button
                                onClick={() => setShowLocationModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} className="text-gray-600" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <MapPin size={20} className="text-color2" />
                                <span className="text-gray-700">{gigData?.postedBy?.location || 'Location not available'}</span>
                            </div>
                            <p className="text-sm text-gray-600">
                                This is the general location of the service provider. Exact address will be shared after booking.
                            </p>
                            <button
                                onClick={() => setShowLocationModal(false)}
                                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-color2/90 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GigDetailPage;

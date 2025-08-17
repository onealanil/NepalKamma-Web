
"use client";

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, X, MapPin, Star, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import LeftSideProvider from '@/components/ui/LeftSideProvider';
import SafeHTML from '@/components/global/SafeHTML';
import Image from 'next/image';
import { useSingleGig } from '@/hooks/gigs/useSingleGig';

const GigDetailPage = () => {
    // State management for all interactive features
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [isRating, setIsRating] = useState(false);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Navigation using Next.js router
    const router = useRouter();
    const params = useParams();
    const gigId = params.gig as string;

    // Fetch gig data using the hook
    const { gig: gigData, isLoading, isError } = useSingleGig(gigId);

    // Calculate average rating from reviews (if available)
    const averageRating = gigData?.reviews && gigData.reviews.length > 0
        ? gigData.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / gigData.reviews.length
        : 0;

    const handleContactProvider = () => {
        if (gigData?.postedBy?._id) {
            router.push(`/dashboard/job-provider/profile/user/${gigData.postedBy._id}`);
        }
    };

    const handleReviewSubmit = async () => {
        if (!rating || !review.trim()) return;
        
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsRating(false);
            setRating(0);
            setReview('');
        }, 2000);
    };

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

    if (isError || (!isLoading && !gigData)) {``
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

                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="p-6 space-y-6">
                                {/* Gig Title */}
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">I will do {gigData.title}</h1>
                                </div>

                                {/* Provider Profile */}
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={handleContactProvider}
                                        className="relative"
                                    >
                                        <div className="relative">
                                            {gigData.postedBy?.profilePic?.url ? (
                                                <Image
                                                    src={gigData.postedBy.profilePic.url}
                                                    alt={gigData.postedBy.username}
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                                    <span className="text-gray-600 text-sm">N/A</span>
                                                </div>
                                            )}
                                            <div
                                                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                                                    gigData.postedBy?.onlineStatus ? 'bg-green-500' : 'bg-red-500'
                                                }`}
                                            />
                                        </div>
                                    </button>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-gray-900">{gigData.postedBy?.username}</h3>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star 
                                                size={15} 
                                                className={`${averageRating > 0 ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} 
                                            />
                                            <span className="font-bold text-gray-900">
                                                {averageRating > 0 ? averageRating.toFixed(1) : '0.0'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Image Gallery */}
                                {gigData.images && gigData.images.length > 0 && (
                                    <div className="space-y-4">
                                        <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
                                            <Image
                                                src={gigData.images[currentImageIndex]?.url || ''}
                                                alt={`Gig image ${currentImageIndex + 1}`}
                                                fill
                                                className="object-cover"
                                            />
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
                                        </div>
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
                                        <SafeHTML html={gigData.gig_description} />
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-gray-900">Skills</h3>
                                    {gigData.postedBy?.skills && gigData.postedBy.skills.length > 0 ? (
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
                                        <span className="font-bold text-gray-900">₹{gigData.price}</span>{' '}
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
                                            onClick={handleContactProvider}
                                            className="bg-color2 text-white px-6 py-3 rounded-lg font-semibold hover:bg-color2/90 transition-colors"
                                        >
                                            Contact Me
                                        </button>
                                        <button
                                            onClick={() => setShowLocationModal(true)}
                                            className="bg-color2 text-white px-6 py-3 rounded-lg font-semibold hover:bg-color2/90 transition-colors"
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
                                    {isRating && (
                                        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                                            <div className="flex gap-4">
                                                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                                    <Image
                                                        src="https://picsum.photos/100/100?random=6"
                                                        alt="Your profile"
                                                        width={48}
                                                        height={48}
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 space-y-3">
                                                    <h4 className="font-bold text-gray-900">Your Name</h4>
                                                    <p className="text-gray-600">Your Location</p>

                                                    {/* Star Rating */}
                                                    <div className="flex gap-1">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                onClick={() => setRating(star)}
                                                                className={`${
                                                                    star <= rating
                                                                        ? 'text-yellow-500 fill-current'
                                                                        : 'text-gray-300'
                                                                } hover:text-yellow-500 transition-colors`}
                                                            >
                                                                <Star size={20} />
                                                            </button>
                                                        ))}
                                                    </div>

                                                    <textarea
                                                        placeholder="Write your review..."
                                                        value={review}
                                                        onChange={(e) => setReview(e.target.value)}
                                                        className="w-full p-3 border border-color2 rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-color2/50"
                                                    />

                                                    <button
                                                        onClick={handleReviewSubmit}
                                                        disabled={isSubmitting || !rating || !review.trim()}
                                                        className="w-full bg-color2 text-white py-3 rounded-lg font-semibold hover:bg-color2/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {!isRating && (
                                        <button
                                            onClick={() => setIsRating(true)}
                                            className="bg-color2 text-white px-6 py-3 rounded-lg font-semibold hover:bg-color2/90 transition-colors"
                                        >
                                            Write a Review
                                        </button>
                                    )}

                                    <hr className="border-gray-200" />

                                    {/* Reviews List */}
                                    <div className="space-y-4">
                                        <p className="text-gray-700">
                                            Total {gigData.reviews?.length || 0} Reviews
                                        </p>

                                        {gigData.reviews && gigData.reviews.length > 0 ? (
                                            <div className="space-y-6">
                                                {gigData.reviews.map((reviewItem: any) => (
                                                    <div key={reviewItem._id} className="flex gap-4">
                                                        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                                            {reviewItem.reviewedBy.profilePic?.url ? (
                                                                <Image
                                                                    src={reviewItem.reviewedBy.profilePic.url}
                                                                    alt={reviewItem.reviewedBy.username}
                                                                    width={48}
                                                                    height={48}
                                                                    className="object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                                                    <span className="text-gray-600 text-xs">N/A</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h4 className="font-bold text-gray-900">
                                                                    {reviewItem.reviewedBy.username}
                                                                </h4>
                                                                <div className="flex gap-1">
                                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                                        <Star
                                                                            key={star}
                                                                            size={14}
                                                                            className={`${
                                                                                star <= reviewItem.rating
                                                                                    ? 'text-yellow-500 fill-current'
                                                                                    : 'text-gray-300'
                                                                            }`}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <p className="text-gray-700 mb-2">{reviewItem.review}</p>
                                                            <p className="text-sm text-gray-500">
                                                                {formatDistanceToNow(new Date(reviewItem.createdAt), { addSuffix: true })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-red-500 font-bold">No reviews found</p>
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
                                    <span className="font-medium">{gigData.category}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Starting Price:</span>
                                    <span className="font-medium">₹{gigData.price}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Provider:</span>
                                    <span className="font-medium">{gigData.postedBy?.username}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Posted:</span>
                                    <span className="font-medium">
                                        {formatDistanceToNow(new Date(gigData.createdAt), { addSuffix: true })}
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
                                    onClick={handleContactProvider}
                                    className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Send size={20} />
                                    Contact Seller
                                </button>
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
                                <span className="text-gray-700">{gigData.postedBy?.location || 'Location not available'}</span>
                            </div>
                            <p className="text-sm text-gray-600">
                                This is the general location of the service provider. Exact address will be shared after booking.
                            </p>
                            <button
                                onClick={() => setShowLocationModal(false)}
                                className="w-full bg-color2 text-white py-3 rounded-lg font-semibold hover:bg-color2/90 transition-colors"
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


"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, Home, ChevronRight, X, MapPin, Star, Bookmark, BookmarkCheck, Send, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import LeftSideSeeker from '@/components/ui/LeftSideSeeker';
import SafeHTML from '@/components/global/SafeHTML';
import Image from 'next/image';

interface GigData {
    _id: string;
    title: string;
    gig_description: string;
    category: string;
    price: number;
    images?: { url: string; public_id: string }[];
    visibility: 'public' | 'private';
    createdAt: string;
    postedBy: {
        _id: string;
        username: string;
        profilePic?: { url: string };
        onlineStatus: boolean;
        skills?: string[];
        address?: {
            coordinates: number[];
            type: string;
        };
        location?: string;
    };
    reviews?: {
        _id: string;
        rating: number;
        review: string;
        reviewedBy: {
            _id: string;
            username: string;
            profilePic?: { url: string };
        };
        createdAt: string;
    }[];
}

const GigDetailPage = () => {
    // State management for all interactive features
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [isRating, setIsRating] = useState(false);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [averageRating, setAverageRating] = useState(0);

    // Navigation using Next.js router
    const router = useRouter();
    const searchParams = useSearchParams();
    const gigId = searchParams.get('id');

    const [gigData, setGigData] = useState<GigData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!gigId) {
            router.push('/dashboard/job-seeker/explore');
            return;
        }

        // Simulate loading - replace with actual API call
        setIsLoading(true);
        setTimeout(() => {
            const mockGigData: GigData = {
                _id: gigId,
                title: 'Professional Web Development Services',
                gig_description: `<p>I will create a modern, responsive website for your business using the latest technologies. My services include:</p>
                <ul>
                    <li>Custom website design and development</li>
                    <li>Responsive design for all devices</li>
                    <li>SEO optimization</li>
                    <li>Fast loading times</li>
                    <li>Modern UI/UX design</li>
                </ul>
                <p>With over 5 years of experience in web development, I guarantee high-quality work that meets your requirements.</p>`,
                category: 'Web Development',
                price: 25000,
                visibility: 'public',
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                images: [
                    { url: 'https://picsum.photos/800/400?random=1', public_id: 'img1' },
                    { url: 'https://picsum.photos/800/400?random=2', public_id: 'img2' },
                    { url: 'https://picsum.photos/800/400?random=3', public_id: 'img3' }
                ],
                postedBy: {
                    _id: 'user123',
                    username: 'John Developer',
                    profilePic: { url: 'https://picsum.photos/100/100?random=4' },
                    onlineStatus: true,
                    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Tailwind CSS'],
                    location: 'Kathmandu, Nepal',
                    address: {
                        coordinates: [85.3240, 27.7172],
                        type: 'Point'
                    }
                },
                reviews: [
                    {
                        _id: 'review1',
                        rating: 5,
                        review: 'Excellent work! Very professional and delivered on time.',
                        reviewedBy: {
                            _id: 'reviewer1',
                            username: 'Sarah Client',
                            profilePic: { url: 'https://picsum.photos/100/100?random=5' }
                        },
                        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
                    }
                ]
            };

            setGigData(mockGigData);
            setAverageRating(4.8);
            setIsLoading(false);
        }, 1000);
    }, [gigId, router]);

    const handleContactProvider = () => {
        if (gigData?.postedBy?._id) {
            router.push(`/dashboard/job-seeker/profile/user/${gigData.postedBy._id}`);
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

    if (!gigData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Gig Not Found</h2>
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
                        {/* Header Breadcrumb */}
                        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Home size={16} className="text-color2" />
                                    <ChevronRight size={16} />
                                    <span>{gigData.category}</span>
                                </div>
                                <button 
                                    onClick={() => router.push('/dashboard/job-seeker/explore')}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <X size={20} className="text-red-500" />
                                </button>
                            </div>
                        </div>

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
                                            {gigData.postedBy.skills.map((skill, index) => (
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
                                        <span className="font-bold text-gray-900">₹{gigData.price.toLocaleString()}</span>{' '}
                                        for this gig.
                                    </p>
                                    <p className="text-red-500 text-sm font-semibold leading-relaxed">
                                        Please be aware that pricing may vary depending on the complexity
                                        and scale of the job. However, we believe in transparent pricing and
                                        ensuring that you receive the best value for your investment.
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
                                                {gigData.reviews.map((reviewItem) => (
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
                                    <span className="font-medium">₹{gigData.price.toLocaleString()}</span>
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
                                    onClick={() => setIsBookmarked(!isBookmarked)}
                                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-colors ${
                                        isBookmarked
                                            ? 'bg-color2 text-white hover:bg-color2/90'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {isBookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                                    {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                                </button>
                                <button
                                    onClick={handleContactProvider}
                                    className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Send size={20} />
                                    Contact Provider
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

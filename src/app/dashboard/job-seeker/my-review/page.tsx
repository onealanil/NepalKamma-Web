"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Star, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import LeftSideSeeker from '@/components/ui/LeftSideSeeker';

interface Review {
    _id: string;
    rating: number;
    review: string;
    reviewedBy: {
        _id: string;
        username: string;
        profilePic?: { url: string };
        location: string;
    };
    jobTitle: string;
    createdAt: string;
}

const ReviewLoader = () => (
    <div className="bg-white rounded-xl p-4 mb-4 shadow-sm animate-pulse">
        <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
        </div>
    </div>
);

const ReviewCard = ({ data }: { data: Review }) => (
    <div className="bg-white rounded-xl p-4 border border-gray-100 mb-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                {data.reviewedBy.profilePic?.url ? (
                    <img
                        src={data.reviewedBy.profilePic.url}
                        alt={data.reviewedBy.username}
                        className="w-full h-full rounded-full object-cover"
                    />
                ) : (
                    <User className="w-6 h-6 text-primary" />
                )}
            </div>

            <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h4 className="font-bold text-gray-900">{data.reviewedBy.username}</h4>
                        <p className="text-sm text-gray-500">{data.reviewedBy.location}</p>
                    </div>
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={16}
                                className={`${i < data.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                        ))}
                        <span className="ml-1 text-sm font-medium text-gray-700">{data.rating}</span>
                    </div>
                </div>

                <div className="mb-2">
                    <p className="text-sm font-medium text-primary">{data.jobTitle}</p>
                </div>

                <p className="text-gray-700 text-sm mb-2 leading-relaxed">{data.review}</p>

                <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(data.createdAt))} ago
                </p>
            </div>
        </div>
    </div>
);

export default function MyReviewPage() {
    const router = useRouter();
    const [isLoadingReview, setIsLoadingReview] = useState(true);
    const [reviewData, setReviewData] = useState<Review[]>([]);
    const [totalRating, setTotalRating] = useState(0);
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        // Simulate loading reviews
        setTimeout(() => {
            const mockReviews: Review[] = [
                {
                    _id: '1',
                    rating: 5,
                    review: 'Excellent work quality and delivered on time. Very professional and communicative throughout the project. Highly recommended!',
                    reviewedBy: {
                        _id: '2',
                        username: 'Alice Johnson',
                        profilePic: { url: 'https://picsum.photos/100/100?random=1' },
                        location: 'Pokhara, Nepal'
                    },
                    jobTitle: 'Website Development Project',
                    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    _id: '2',
                    rating: 4,
                    review: 'Good communication and professional approach. The design was exactly what we needed. Will work again in the future.',
                    reviewedBy: {
                        _id: '3',
                        username: 'Ram Sharma',
                        profilePic: { url: 'https://picsum.photos/100/100?random=2' },
                        location: 'Lalitpur, Nepal'
                    },
                    jobTitle: 'Mobile App UI Design',
                    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    _id: '3',
                    rating: 5,
                    review: 'Outstanding content writing skills. The articles were well-researched and SEO optimized. Great attention to detail.',
                    reviewedBy: {
                        _id: '4',
                        username: 'Sita Patel',
                        profilePic: { url: 'https://picsum.photos/100/100?random=3' },
                        location: 'Kathmandu, Nepal'
                    },
                    jobTitle: 'Content Writing Project',
                    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    _id: '4',
                    rating: 4,
                    review: 'Very satisfied with the logo design. Creative and professional work. Minor revisions were handled quickly.',
                    reviewedBy: {
                        _id: '5',
                        username: 'John Doe',
                        profilePic: { url: 'https://picsum.photos/100/100?random=4' },
                        location: 'Bhaktapur, Nepal'
                    },
                    jobTitle: 'Logo Design Project',
                    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    _id: '5',
                    rating: 5,
                    review: 'Fantastic developer! Built our e-commerce platform with all the features we requested. Highly technical and reliable.',
                    reviewedBy: {
                        _id: '6',
                        username: 'Tech Solutions Ltd',
                        profilePic: { url: 'https://picsum.photos/100/100?random=5' },
                        location: 'Kathmandu, Nepal'
                    },
                    jobTitle: 'E-commerce Platform Development',
                    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
                }
            ];

            const totalReviews = mockReviews.length;
            const avgRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

            setReviewData(mockReviews);
            setTotalRating(totalReviews);
            setAverageRating(avgRating);
            setIsLoadingReview(false);
        }, 1500);
    }, []);

    const handleBackPress = () => {
        router.push('/dashboard/job-seeker');
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
                        </div>

                        {/* Loading State */}
                        {isLoadingReview && (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            </div>
                        )}

                        {/* Content */}
                        {!isLoadingReview && (
                            <div className="space-y-6">
                                {/* Stats */}
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-gray-600 font-medium text-sm">Total Reviews:</p>
                                            <p className="text-primary font-bold text-2xl">{totalRating || 0}</p>
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
                                        <div className="space-y-4">
                                            {reviewData.map((review) => (
                                                <ReviewCard key={review._id} data={review} />
                                            ))}
                                        </div>
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
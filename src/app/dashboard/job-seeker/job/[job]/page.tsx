"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, Home, ChevronRight, X, MapPin, Star, Bookmark, BookmarkCheck, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import LeftSideSeeker from '@/components/ui/LeftSideSeeker';

interface JobData {
    _id: string;
    title: string;
    description: string;
    category: string;
    skills_required: string[];
    payment_method: string[];
    price: number;
    address: string;
    location: string;
    experiesIn: string;
    postedBy: {
        _id: string;
        username: string;
        profilePic?: { url: string };
        onlineStatus: boolean;
    };
}

interface Review {
    _id: string;
    rating: number;
    review: string;
    reviewedBy: {
        username: string;
        profilePic?: { url: string };
        location: string;
    };
    createdAt: string;
}

// Review Component
const ReviewCard = ({ data }: { data: Review }) => (
    <div className="bg-white rounded-xl p-4 border border-gray-100 mb-4">
        <div className="flex items-start gap-3">
            <img
                src={data.reviewedBy.profilePic?.url || 'https://picsum.photos/100/100'}
                alt={data.reviewedBy.username}
                className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{data.reviewedBy.username}</h4>
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={14}
                                className={`${i < data.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                        ))}
                    </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">{data.reviewedBy.location}</p>
                <p className="text-gray-700 text-sm">{data.review}</p>
                <p className="text-xs text-gray-500 mt-2">
                    {formatDistanceToNow(new Date(data.createdAt))} ago
                </p>
            </div>
        </div>
    </div>
);

export default function SingleJobPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const jobId = searchParams.get('id');

    const [jobData, setJobData] = useState<JobData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPostSaved, setIsPostSaved] = useState(false);
    const [averageRating, setAverageRating] = useState(0);
    const [isApplying, setIsApplying] = useState(false);
    const [showMapModal, setShowMapModal] = useState(false);
    const [isRating, setIsRating] = useState(false);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reviewData, setReviewData] = useState<Review[]>([]);
    const [isFetchReview, setIsFetchReview] = useState(false);

    // Mock current user
    const [currentUser] = useState({
        _id: '1',
        username: 'John Doe',
        profilePic: { url: 'https://picsum.photos/100/100?random=user' },
        location: 'Kathmandu, Nepal'
    });

    useEffect(() => {
        // Handle missing jobId
        if (!jobId) {
            setIsLoading(false);
            return;
        }

        // Mock data loading
        setTimeout(() => {
            const mockJobData: JobData = {
                _id: jobId,
                title: 'Full Stack Web Developer Needed',
                description: `<p>We are looking for an experienced full stack developer to build a modern web application. The project involves creating a responsive frontend using React and a robust backend with Node.js.</p>
                <p><strong>Requirements:</strong></p>
                <ul>
                    <li>3+ years of experience in web development</li>
                    <li>Proficiency in React, Node.js, and MongoDB</li>
                    <li>Experience with modern development tools</li>
                    <li>Good communication skills</li>
                </ul>`,
                category: 'Web Development',
                skills_required: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Tailwind CSS'],
                payment_method: ['Bank Transfer', 'Digital Wallet', 'Cash'],
                price: 50000,
                address: 'Thamel, Kathmandu, Nepal',
                location: 'Kathmandu',
                experiesIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                postedBy: {
                    _id: '2',
                    username: 'Tech Solutions Ltd',
                    profilePic: { url: 'https://picsum.photos/100/100?random=company' },
                    onlineStatus: true
                }
            };

            const mockReviews: Review[] = [
                {
                    _id: '1',
                    rating: 5,
                    review: 'Excellent work quality and delivered on time. Highly recommended!',
                    reviewedBy: {
                        username: 'Alice Johnson',
                        profilePic: { url: 'https://picsum.photos/100/100?random=1' },
                        location: 'Pokhara, Nepal'
                    },
                    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    _id: '2',
                    rating: 4,
                    review: 'Good communication and professional approach. Will work again.',
                    reviewedBy: {
                        username: 'Ram Sharma',
                        profilePic: { url: 'https://picsum.photos/100/100?random=2' },
                        location: 'Lalitpur, Nepal'
                    },
                    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
                }
            ];

            setJobData(mockJobData);
            setAverageRating(4.8);
            setReviewData(mockReviews);
            setIsLoading(false);
        }, 1000);
    }, [jobId]);

    const handleSaveJob = () => {
        setIsPostSaved(!isPostSaved);
    };

    const handleApplyJob = () => {
        setIsApplying(true);
        setTimeout(() => {
            setIsApplying(false);
            alert('Application submitted successfully!');
        }, 2000);
    };

    const handleReviewSubmit = () => {
        if (rating === 0 || !review.trim()) return;

        setIsSubmitting(true);
        setTimeout(() => {
            const newReview: Review = {
                _id: Date.now().toString(),
                rating,
                review,
                reviewedBy: currentUser,
                createdAt: new Date().toISOString()
            };
            setReviewData(prev => [newReview, ...prev]);
            setRating(0);
            setReview('');
            setIsSubmitting(false);
            setIsRating(false);
        }, 1000);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading job details...</p>
                </div>
            </div>
        );
    }

    if (!jobId || !jobData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">Job not found</p>
                    <button
                        onClick={() => router.push('/dashboard/job-seeker/explore')}
                        className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                    >
                        Browse Jobs
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full max-w-md lg:max-w-7xl mx-auto px-4 pb-20">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Left Sidebar - Hidden on mobile, visible on desktop */}
                    <LeftSideSeeker />
                    
                    {/* Main Content */}
                    <div className="lg:col-span-6 py-6">
                        {/* Header Breadcrumb */}
                        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Home size={16} className="text-primary" />
                                    <ChevronRight size={16} />
                                    <span>{jobData.category}</span>
                                </div>
                                <button 
                                    onClick={() => router.push(`/dashboard/job-seeker/explore`)}
                                    className="p-2 rounded-full transition-colors"
                                >
                                    <X size={20} className="text-red-500" />
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="p-6 space-y-6">
                                {/* Job Title */}
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{jobData.title}</h1>
                                </div>

                                {/* Poster Info */}
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => router.push(`/dashboard/job-seeker/profile/${jobData.postedBy._id}`)}
                                        className="relative"
                                    >
                                        <img
                                            src={jobData.postedBy.profilePic?.url || 'https://picsum.photos/100/100'}
                                            alt={jobData.postedBy.username}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${jobData.postedBy.onlineStatus ? 'bg-green-500' : 'bg-red-500'
                                            }`}></div>
                                    </button>

                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-gray-900">{jobData.postedBy.username}</h3>
                                            <button
                                                onClick={handleSaveJob}
                                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                            >
                                                {isPostSaved ? (
                                                    <BookmarkCheck size={20} className="text-primary" />
                                                ) : (
                                                    <Bookmark size={20} className="text-primary" />
                                                )}
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star size={16} className="text-yellow-400 fill-current" />
                                            <span className="font-semibold text-gray-900">{averageRating.toFixed(1)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Job Description */}
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 mb-3">About this Job</h2>
                                    <div
                                        className="prose prose-sm max-w-none text-gray-700"
                                        dangerouslySetInnerHTML={{ __html: jobData.description }}
                                    />
                                </div>

                                {/* Skills Required */}
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 mb-3">Skills Required</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {jobData.skills_required.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Payment */}
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 mb-3">Payment</h2>
                                    <p className="text-gray-700 mb-2">
                                        Payment Starts from Rs. <span className="font-bold text-gray-900">{jobData.price.toLocaleString()}</span>
                                    </p>
                                    <p className="text-red-500 text-sm leading-relaxed">
                                        Payment varies based on experience, qualifications, and project scope.
                                        Contact the job provider for details before applying. Thank you for your proactive approach.
                                    </p>
                                </div>

                                {/* Payment Methods */}
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 mb-3">Payment Method</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {jobData.payment_method.map((method, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm border border-gray-200"
                                            >
                                                {method}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 mb-3">For more Details</h2>
                                    <div className="flex gap-4 justify-center">
                                        <button
                                            onClick={handleApplyJob}
                                            disabled={isApplying}
                                            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                                        >
                                            {isApplying ? 'Applying...' : 'Apply Now'}
                                        </button>
                                        <button
                                            onClick={() => setShowMapModal(true)}
                                            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
                                        >
                                            <MapPin size={18} />
                                            View on Map
                                        </button>
                                    </div>
                                </div>

                                {/* Job Expiry */}
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-gray-700">Job will expire in</span>
                                    <span className="text-red-500 font-semibold">
                                        {formatDistanceToNow(new Date(jobData.experiesIn))}
                                    </span>
                                </div>

                                {/* Reviews Section */}
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Seller Reviews</h2>
                                    <hr className="mb-4" />

                                    {/* Add Review */}
                                    {isRating && (
                                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                            <div className="flex gap-3">
                                                <img
                                                    src={currentUser.profilePic.url}
                                                    alt={currentUser.username}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900">{currentUser.username}</h4>
                                                    <p className="text-sm text-gray-600 mb-2">{currentUser.location}</p>

                                                    {/* Star Rating */}
                                                    <div className="flex gap-1 mb-3">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                onClick={() => setRating(star)}
                                                                className="focus:outline-none"
                                                            >
                                                                <Star
                                                                    size={20}
                                                                    className={`${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                                                                />
                                                            </button>
                                                        ))}
                                                    </div>

                                                    <textarea
                                                        value={review}
                                                        onChange={(e) => setReview(e.target.value)}
                                                        placeholder="Write your review..."
                                                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                                        rows={3}
                                                    />

                                                    <button
                                                        onClick={handleReviewSubmit}
                                                        disabled={isSubmitting || rating === 0 || !review.trim()}
                                                        className="mt-3 px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                                                    >
                                                        {isSubmitting ? 'Submitting...' : 'Submit'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Reviews List */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <p className="text-gray-700">Total {reviewData.length} Reviews</p>
                                            {!isRating && (
                                                <button
                                                    onClick={() => setIsRating(true)}
                                                    className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary/20 transition-colors"
                                                >
                                                    Write Review
                                                </button>
                                            )}
                                        </div>

                                        {reviewData.length > 0 ? (
                                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                                {reviewData.map((reviewItem) => (
                                                    <ReviewCard key={reviewItem._id} data={reviewItem} />
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-red-500 text-center py-8">No reviews found</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar - Hidden on mobile, visible on desktop */}
                    <div className="hidden lg:block lg:col-span-3 py-6">
                        <div className="sticky top-6 space-y-6">
                            {/* Job Actions */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={handleApplyJob}
                                        disabled={isApplying}
                                        className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                                    >
                                        {isApplying ? 'Applying...' : 'Apply Now'}
                                    </button>
                                    <button
                                        onClick={handleSaveJob}
                                        className="w-full flex items-center justify-center gap-2 bg-primary/10 text-primary py-3 rounded-lg font-semibold hover:bg-primary/20 transition-colors"
                                    >
                                        {isPostSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                                        {isPostSaved ? 'Saved' : 'Save Job'}
                                    </button>
                                </div>
                            </div>

                            {/* Job Stats */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4">Job Details</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Category:</span>
                                        <span className="font-medium">{jobData.category}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Budget:</span>
                                        <span className="font-medium">Rs. {jobData.price.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Location:</span>
                                        <span className="font-medium">{jobData.location}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Expires:</span>
                                        <span className="font-medium text-red-500">
                                            {formatDistanceToNow(new Date(jobData.experiesIn))}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Modal */}
            {showMapModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Job Location</h3>
                            <button
                                onClick={() => setShowMapModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                            <MapPin size={18} className="text-primary" />
                            <span>{jobData.address}</span>
                        </div>
                        <div className="mt-4 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                            <p className="text-gray-500">Map integration coming soon</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

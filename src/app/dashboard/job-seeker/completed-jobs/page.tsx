"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, CheckCircle, Calendar, DollarSign, MapPin, Eye, Star } from 'lucide-react';
import LeftSideSeeker from '@/components/ui/LeftSideSeeker';

interface CompletedJob {
    _id: string;
    title: string;
    description: string;
    category: string;
    skills_required: string[];
    payment_method: string[];
    price: number;
    address: string;
    location: string;
    completedAt: string;
    rating?: number;
    paymentStatus: 'paid' | 'pending' | 'processing';
    postedBy: {
        _id: string;
        username: string;
        profilePic?: { url: string };
        onlineStatus: boolean;
    };
}

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

const CompletedJobCard = ({
    data,
    onViewPayment
}: {
    data: CompletedJob;
    onViewPayment: (job: CompletedJob) => void;
}) => {
    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-600';
            case 'pending': return 'bg-yellow-100 text-yellow-600';
            case 'processing': return 'bg-blue-100 text-blue-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    {data.postedBy.profilePic?.url ? (
                        <img
                            src={data.postedBy.profilePic.url}
                            alt={data.postedBy.username}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <span className="text-primary font-semibold text-lg">
                            {data.postedBy.username.charAt(0).toUpperCase()}
                        </span>
                    )}
                </div>

                <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">
                            {data.title}
                        </h3>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {data.description.replace(/<[^>]*>/g, '')}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            <span>{data.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{formatDate(data.completedAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <DollarSign size={14} />
                            <span>Rs. {data.price.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${getPaymentStatusColor(data.paymentStatus)}`}>
                                {data.paymentStatus.charAt(0).toUpperCase() + data.paymentStatus.slice(1)}
                            </span>

                            {data.rating && (
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                    <span className="text-sm font-medium text-gray-700">{data.rating}</span>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => onViewPayment(data)}
                            className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
                        >
                            <Eye size={14} />
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Payment Modal Component
const PaymentModal = ({
    isOpen,
    onClose,
    data
}: {
    isOpen: boolean;
    onClose: () => void;
    data: CompletedJob | null;
}) => {
    if (!isOpen || !data) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Payment Details</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">{data.title}</h3>
                            <p className="text-gray-600 text-sm">{data.description.replace(/<[^>]*>/g, '')}</p>
                        </div>

                        <div className="border-t pt-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">Amount:</span>
                                    <p className="font-semibold">Rs. {data.price.toLocaleString()}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Status:</span>
                                    <p className="font-semibold capitalize">{data.paymentStatus}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Completed:</span>
                                    <p className="font-semibold">{new Date(data.completedAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Client:</span>
                                    <p className="font-semibold">{data.postedBy.username}</p>
                                </div>
                            </div>
                        </div>

                        {data.rating && (
                            <div className="border-t pt-4">
                                <span className="text-gray-500 text-sm">Rating:</span>
                                <div className="flex items-center gap-1 mt-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < data.rating! ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                                        />
                                    ))}
                                    <span className="ml-2 text-sm font-medium">{data.rating}/5</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 pt-4 border-t">
                        <button
                            onClick={onClose}
                            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function CompletedJobs() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [jobs, setJobs] = useState<CompletedJob[]>([]);
    const [selectedJob, setSelectedJob] = useState<CompletedJob | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    useEffect(() => {
        // Simulate loading completed jobs
        setTimeout(() => {
            const mockCompletedJobs: CompletedJob[] = [
                {
                    _id: '1',
                    title: 'Website Development Project',
                    description: 'Built a complete e-commerce website with React and Node.js backend.',
                    category: 'Web Development',
                    skills_required: ['React', 'Node.js', 'MongoDB'],
                    payment_method: ['Bank Transfer'],
                    price: 75000,
                    address: 'Thamel, Kathmandu',
                    location: 'Kathmandu',
                    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                    rating: 5,
                    paymentStatus: 'paid',
                    postedBy: {
                        _id: '2',
                        username: 'Tech Solutions Ltd',
                        profilePic: { url: 'https://picsum.photos/100/100?random=1' },
                        onlineStatus: true
                    }
                },
                {
                    _id: '2',
                    title: 'Mobile App UI Design',
                    description: 'Created modern UI designs for a food delivery mobile application.',
                    category: 'Design',
                    skills_required: ['Figma', 'UI Design'],
                    payment_method: ['Digital Wallet'],
                    price: 35000,
                    address: 'Lalitpur, Nepal',
                    location: 'Lalitpur',
                    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    rating: 4,
                    paymentStatus: 'processing',
                    postedBy: {
                        _id: '3',
                        username: 'Creative Agency',
                        profilePic: { url: 'https://picsum.photos/100/100?random=2' },
                        onlineStatus: false
                    }
                },
                {
                    _id: '3',
                    title: 'Content Writing Project',
                    description: 'Wrote SEO-optimized blog posts for a travel website.',
                    category: 'Writing',
                    skills_required: ['Content Writing', 'SEO'],
                    payment_method: ['Cash'],
                    price: 15000,
                    address: 'Pokhara, Nepal',
                    location: 'Pokhara',
                    completedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
                    rating: 5,
                    paymentStatus: 'pending',
                    postedBy: {
                        _id: '4',
                        username: 'Travel Blog',
                        profilePic: { url: 'https://picsum.photos/100/100?random=3' },
                        onlineStatus: true
                    }
                }
            ];

            setJobs(mockCompletedJobs);
            setIsLoading(false);
        }, 1500);
    }, []);

    const handleViewPayment = (job: CompletedJob) => {
        setSelectedJob(job);
        setShowPaymentModal(true);
    };

    const handleBackPress = () => {
        router.push('/dashboard/job-seeker');
    };

    const totalEarnings = jobs.reduce((sum, job) => sum + job.price, 0);
    const paidJobs = jobs.filter(job => job.paymentStatus === 'paid').length;

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
                                    Completed Jobs List
                                </span>
                            </button>

                            <p className="text-gray-700 font-medium ml-8">
                                Total jobs ({jobs.length})
                            </p>
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
                                            {jobs.map((job) => (
                                                <CompletedJobCard
                                                    key={job._id}
                                                    data={job}
                                                    onViewPayment={handleViewPayment}
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
        </div>
    );
}

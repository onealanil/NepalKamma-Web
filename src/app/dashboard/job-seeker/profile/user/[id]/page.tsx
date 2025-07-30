"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Star, MapPin, MessageCircle, Phone, MoreHorizontal, Verified, ChevronRight } from 'lucide-react';
import LeftSideSeeker from '@/components/ui/LeftSideSeeker';

interface User {
    _id: string;
    username: string;
    profilePic?: { url: string };
    bio?: string;
    about_me?: string;
    location?: string;
    isDocumentVerified: 'verified' | 'pending' | 'rejected';
    mileStone: number;
    averageRating: number;
    completedJobs: number;
    skills: string[];
}

interface Job {
    _id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    images: { url: string }[];
    createdAt: string;
}

const JobCard = ({ data, onClick }: { data: Job; onClick: () => void }) => (
    <div
        onClick={onClick}
        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
    >
        <div className="mb-3">
            {data.images && data.images.length > 0 && (
                <img
                    src={data.images[0].url}
                    alt={data.title}
                    className="w-full h-40 object-cover rounded-lg"
                />
            )}
        </div>

        <div className="space-y-2">
            <h3 className="font-bold text-gray-900 text-lg line-clamp-2">
                {data.title}
            </h3>

            <p className="text-gray-600 text-sm line-clamp-3">
                {data.description.replace(/<[^>]*>/g, '')}
            </p>

            <div className="flex items-center justify-between">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {data.category}
                </span>
                <span className="font-bold text-lg text-gray-900">
                    Rs. {data.price.toLocaleString()}
                </span>
            </div>
        </div>
    </div>
);

const MoreModal = ({
    isOpen,
    onClose,
    userAddress
}: {
    isOpen: boolean;
    onClose: () => void;
    userAddress?: string;
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">More Options</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">Address</h4>
                        <p className="text-gray-600">
                            {userAddress || 'No address provided'}
                        </p>
                    </div>

                    <button className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors">
                        Report User
                    </button>

                    <button
                        onClick={onClose}
                        className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

const JobDetailModal = ({
    isOpen,
    onClose,
    job
}: {
    isOpen: boolean;
    onClose: () => void;
    job: Job | null;
}) => {
    if (!isOpen || !job) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    {job.images && job.images.length > 0 && (
                        <div className="mb-4">
                            <img
                                src={job.images[0].url}
                                alt={job.title}
                                className="w-full h-64 object-cover rounded-lg"
                            />
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                            <p className="text-gray-600 leading-relaxed">
                                {job.description.replace(/<[^>]*>/g, '')}
                            </p>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="bg-primary/10 text-primary px-4 py-2 rounded-full font-medium">
                                {job.category}
                            </span>
                            <span className="font-bold text-2xl text-gray-900">
                                Rs. {job.price.toLocaleString()}
                            </span>
                        </div>

                        <div className="pt-4 border-t">
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
        </div>
    );
};

export default function UserProfilePage() {
    const router = useRouter();
    const params = useParams();
    const userId = params.id as string;

    const [user, setUser] = useState<User | null>(null);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchAverageRating, setIsFetchAverageRating] = useState(false);
    const [averageRating, setAverageRating] = useState(0);
    const [currentJobIndex, setCurrentJobIndex] = useState(0);
    const [moreModalVisible, setMoreModalVisible] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [showJobModal, setShowJobModal] = useState(false);

    useEffect(() => {
        // Simulate loading user data
        setTimeout(() => {
            const mockUser: User = {
                _id: userId,
                username: 'Sarah Johnson',
                profilePic: { url: 'https://picsum.photos/200/200?random=1' },
                bio: 'Professional web developer with 5+ years of experience in creating modern, responsive websites and applications.',
                about_me: 'I am a passionate full-stack developer specializing in React, Node.js, and modern web technologies. I love creating user-friendly applications that solve real-world problems. My goal is to deliver high-quality work that exceeds client expectations.',
                location: 'Kathmandu, Nepal',
                isDocumentVerified: 'verified',
                mileStone: 3,
                averageRating: 4.8,
                completedJobs: 127,
                skills: ['React', 'Node.js', 'MongoDB', 'TypeScript']
            };

            const mockJobs: Job[] = [
                {
                    _id: '1',
                    title: 'Modern E-commerce Website Development',
                    description: 'Complete e-commerce solution with payment integration, user authentication, and admin dashboard. Built with React and Node.js.',
                    price: 85000,
                    category: 'Web Development',
                    images: [{ url: 'https://picsum.photos/400/300?random=1' }],
                    createdAt: new Date().toISOString()
                },
                {
                    _id: '2',
                    title: 'Mobile App UI/UX Design',
                    description: 'Complete mobile app design with modern UI/UX principles, including wireframes, prototypes, and final designs.',
                    price: 45000,
                    category: 'UI/UX Design',
                    images: [{ url: 'https://picsum.photos/400/300?random=2' }],
                    createdAt: new Date().toISOString()
                },
                {
                    _id: '3',
                    title: 'SEO Content Writing Package',
                    description: 'Professional content writing services including blog posts, web copy, and SEO-optimized articles for better search rankings.',
                    price: 25000,
                    category: 'Content Writing',
                    images: [{ url: 'https://picsum.photos/400/300?random=3' }],
                    createdAt: new Date().toISOString()
                }
            ];

            setUser(mockUser);
            setJobs(mockJobs);
            setAverageRating(mockUser.averageRating);
            setIsLoading(false);
        }, 1500);
    }, [userId]);

    const handleBackPress = () => {
        router.back();
    };

    const handleMessagePress = () => {
        router.push(`/dashboard/job-seeker/chat/${userId}`);
    };

    const handleCallPress = () => {
        // Implement call functionality
        alert('Call functionality would be implemented here');
    };

    const handleNextJob = () => {
        if (jobs.length > 0) {
            setCurrentJobIndex((prev) => (prev + 1) % jobs.length);
        }
    };

    const handleJobClick = (job: Job) => {
        setSelectedJob(job);
        setShowJobModal(true);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h2>
                    <p className="text-gray-600">The user you&apos;re looking for doesn&apos;t exist.</p>
                </div>
            </div>
        );
    }

    const currentJob = jobs[currentJobIndex];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full max-w-md lg:max-w-7xl mx-auto px-4 pb-20">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Left Sidebar - Hidden on mobile, visible on desktop */}
                    <LeftSideSeeker />

                    {/* Main Content */}
                    <div className="lg:col-span-6 py-6">
                        {/* Profile Header */}
                        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                            <div className="flex items-start gap-5">
                                {/* Profile Picture */}
                                <div className="relative">
                                    <img
                                        src={user.profilePic?.url || 'https://picsum.photos/200/200'}
                                        alt={user.username}
                                        className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                                    />
                                </div>

                                {/* User Details */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
                                        {user.isDocumentVerified === 'verified' && (
                                            <Verified className="w-5 h-5 text-green-500" />
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1 mb-2">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                        <span className="font-semibold text-gray-900">
                                            {isFetchAverageRating ? 'Loading...' : averageRating?.toFixed(1) || 0}
                                        </span>
                                    </div>

                                    <p className="text-gray-700 mb-3 leading-relaxed">
                                        {user.bio || <span className="text-red-500 font-bold">No bio</span>}
                                    </p>

                                    <div className="flex items-center gap-1 mb-3">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        <span className="text-gray-700">
                                            {user.location || <span className="text-red-500 font-bold">No location</span>}
                                        </span>
                                    </div>

                                    <div className="inline-block border border-primary rounded-lg px-4 py-2">
                                        <span className="text-gray-700 font-medium">
                                            Level {user.mileStone} Seller
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between gap-2 mb-6">
                            <button
                                onClick={handleMessagePress}
                                className="flex items-center gap-2 bg-primary text-white px-10 py-2 rounded-md font-semibold hover:bg-primary/90 transition-colors"
                            >
                                <MessageCircle size={17} />
                                Message
                            </button>

                            <button
                                onClick={handleCallPress}
                                className="flex items-center gap-2 bg-primary text-white px-20 py-2 rounded-md font-semibold hover:bg-primary/90 transition-colors"
                            >
                                <Phone size={17} />
                                Call
                            </button>

                            <button
                                onClick={() => setMoreModalVisible(true)}
                                className="flex items-center gap-2 bg-primary text-white px-10 py-2 rounded-md font-semibold hover:bg-primary/90 transition-colors"
                            >
                                <MoreHorizontal size={17} />
                                More
                            </button>
                        </div>

                        {/* About Me Section */}
                        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">About me</h2>
                            <p className="text-gray-700 leading-relaxed">
                                {user.about_me || <span className="text-red-500 font-bold">No about me</span>}
                            </p>
                        </div>

                        {/* Jobs Section */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Jobs</h2>

                            {jobs.length > 0 ? (
                                <div className="space-y-4">
                                    <JobCard
                                        data={currentJob}
                                        onClick={() => handleJobClick(currentJob)}
                                    />

                                    <button
                                        onClick={handleNextJob}
                                        className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                                    >
                                        Next Job
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No jobs available</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar - Hidden on mobile, visible on desktop */}
                    <div className="hidden lg:block lg:col-span-3 py-6">
                        <div className="sticky top-6 space-y-6">
                            {/* User Stats */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4">User Stats</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Completed Jobs</span>
                                        <span className="font-bold text-primary">{user.completedJobs}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Average Rating</span>
                                        <span className="font-bold text-yellow-500">{user.averageRating.toFixed(1)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Level</span>
                                        <span className="font-bold text-green-600">{user.mileStone}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Verified</span>
                                        <span className={`font-bold ${user.isDocumentVerified === 'verified' ? 'text-green-600' : 'text-red-600'}`}>
                                            {user.isDocumentVerified === 'verified' ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {user.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <MoreModal
                isOpen={moreModalVisible}
                onClose={() => setMoreModalVisible(false)}
                userAddress={user.location}
            />

            <JobDetailModal
                isOpen={showJobModal}
                onClose={() => setShowJobModal(false)}
                job={selectedJob}
            />
        </div>
    );
}
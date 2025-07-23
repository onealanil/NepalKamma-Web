"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Bookmark, MapPin, Clock, DollarSign } from 'lucide-react';
import LeftSideSeeker from '@/components/ui/LeftSideSeeker';

interface SavedJob {
    _id: string;
    title: string;
    description: string;
    category: string;
    skills_required: string[];
    payment_method: string[];
    price: number;
    address: string;
    location: string;
    urgency?: 'high' | 'medium' | 'low';
    experiesIn: string;
    postedBy: {
        _id: string;
        username: string;
        profilePic?: { url: string };
        onlineStatus: boolean;
    };
}

const JobCardLoader = () => (
    <div className="bg-white rounded-xl p-4 mb-4 shadow-sm animate-pulse">
        <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
        </div>
    </div>
);

const JobCard = ({ data, onSelect }: { data: SavedJob; onSelect: (job: SavedJob) => void }) => {
    const getUrgencyColor = (urgency?: string) => {
        switch (urgency) {
            case 'high': return 'bg-red-100 text-red-600';
            case 'medium': return 'bg-yellow-100 text-yellow-600';
            case 'low': return 'bg-green-100 text-green-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div 
            onClick={() => onSelect(data)}
            className="bg-white rounded-xl p-4 mb-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
        >
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
                        <Bookmark className="w-5 h-5 text-primary fill-current" />
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
                            <DollarSign size={14} />
                            <span>Rs. {data.price.toLocaleString()}</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                            {data.skills_required.slice(0, 2).map((skill, index) => (
                                <span 
                                    key={index}
                                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                                >
                                    {skill}
                                </span>
                            ))}
                            {data.skills_required.length > 2 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                    +{data.skills_required.length - 2}
                                </span>
                            )}
                        </div>
                        
                        {data.urgency && (
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${getUrgencyColor(data.urgency)}`}>
                                {data.urgency}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function SavedJobs() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
    const [selectedJob, setSelectedJob] = useState<SavedJob | null>(null);

    useEffect(() => {
        // Simulate loading saved jobs
        setTimeout(() => {
            const mockSavedJobs: SavedJob[] = [
                {
                    _id: '1',
                    title: 'Full Stack Web Developer Needed',
                    description: 'We are looking for an experienced full stack developer to build a modern web application.',
                    category: 'Web Development',
                    skills_required: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
                    payment_method: ['Bank Transfer', 'Digital Wallet'],
                    price: 50000,
                    address: 'Thamel, Kathmandu',
                    location: 'Kathmandu',
                    urgency: 'high',
                    experiesIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    postedBy: {
                        _id: '2',
                        username: 'Tech Solutions Ltd',
                        profilePic: { url: 'https://picsum.photos/100/100?random=1' },
                        onlineStatus: true
                    }
                },
                {
                    _id: '2',
                    title: 'Mobile App UI/UX Design',
                    description: 'Looking for a creative designer to design mobile app interfaces.',
                    category: 'Design',
                    skills_required: ['Figma', 'Adobe XD', 'UI Design'],
                    payment_method: ['Cash', 'Bank Transfer'],
                    price: 25000,
                    address: 'Lalitpur, Nepal',
                    location: 'Lalitpur',
                    urgency: 'medium',
                    experiesIn: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                    postedBy: {
                        _id: '3',
                        username: 'Creative Agency',
                        profilePic: { url: 'https://picsum.photos/100/100?random=2' },
                        onlineStatus: false
                    }
                }
            ];
            
            setSavedJobs(mockSavedJobs);
            setIsLoading(false);
        }, 1500);
    }, []);

    const handleJobSelect = (job: SavedJob) => {
        setSelectedJob(job);
        router.push(`/dashboard/job-seeker/job?id=${job._id}`);
    };

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
                                    Saved Jobs List
                                </span>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="pb-20">
                            {isLoading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3, 4, 5].map((item) => (
                                        <JobCardLoader key={item} />
                                    ))}
                                </div>
                            ) : (
                                <>
                                    {savedJobs.length === 0 ? (
                                        <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                                            <div className="text-4xl mb-4">📋</div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                                No Saved Jobs
                                            </h3>
                                            <p className="text-red-500 font-medium mb-4">
                                                No Saved jobs available
                                            </p>
                                            <button
                                                onClick={() => router.push('/dashboard/job-seeker/explore')}
                                                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                                            >
                                                Browse Jobs
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {savedJobs.map((job) => (
                                                <JobCard
                                                    key={job._id}
                                                    data={job}
                                                    onSelect={handleJobSelect}
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
                            {/* Quick Stats */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4">Saved Jobs</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Saved</span>
                                        <span className="font-semibold text-primary">{savedJobs.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">High Priority</span>
                                        <span className="font-semibold text-red-600">
                                            {savedJobs.filter(job => job.urgency === 'high').length}
                                        </span>
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
        </div>
    );
}

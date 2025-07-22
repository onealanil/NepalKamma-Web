"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import LeftSideSeeker from '@/components/ui/LeftSideSeeker';

interface JobProvider {
    _id: string;
    username: string;
    profilePic?: { url: string };
    title?: string;
    location?: string;
    averageRating: number;
    completedJobs: number;
    isVerified: boolean;
    skills: string[];
}

// Loading skeleton component
const PeopleLoader = () => (
    <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100 animate-pulse">
        <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded mb-2 w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
        </div>
    </div>
);

// People card component
const PeopleCard = ({ data, onClick }: { data: JobProvider; onClick: () => void }) => (
    <div 
        onClick={onClick}
        className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
    >
        <div className="flex items-center gap-4">
            <div className="relative">
                <img
                    src={data.profilePic?.url || 'https://picsum.photos/100/100'}
                    alt={data.username}
                    className="w-16 h-16 rounded-full object-cover"
                />
                {data.isVerified && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </div>
            
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 text-lg">{data.username}</h3>
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm text-gray-600">{data.averageRating.toFixed(1)}</span>
                    </div>
                </div>
                
                {data.title && (
                    <p className="text-gray-600 text-sm mb-1">{data.title}</p>
                )}
                
                {data.location && (
                    <p className="text-gray-500 text-xs mb-2 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {data.location}
                    </p>
                )}
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{data.completedJobs} jobs completed</span>
                    {data.skills.length > 0 && (
                        <span className="bg-gray-100 px-2 py-1 rounded">
                            {data.skills[0]}
                            {data.skills.length > 1 && ` +${data.skills.length - 1}`}
                        </span>
                    )}
                </div>
            </div>
            
            <div className="flex flex-col items-center gap-2">
                <button className="p-2 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
);

export default function TopBuyerPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [jobProviders, setJobProviders] = useState<JobProvider[]>([]);

    useEffect(() => {
        // Simulate loading
        setTimeout(() => {
            // Mock data
            const mockJobProviders: JobProvider[] = [
                {
                    _id: '1',
                    username: 'John Smith',
                    profilePic: { url: 'https://picsum.photos/100/100?random=1' },
                    title: 'Senior Web Developer',
                    location: 'New York, NY',
                    averageRating: 4.8,
                    completedJobs: 127,
                    isVerified: true,
                    skills: ['React', 'Node.js', 'TypeScript']
                },
                {
                    _id: '2',
                    username: 'Sarah Johnson',
                    profilePic: { url: 'https://picsum.photos/100/100?random=2' },
                    title: 'UI/UX Designer',
                    location: 'San Francisco, CA',
                    averageRating: 4.9,
                    completedJobs: 89,
                    isVerified: true,
                    skills: ['Figma', 'Adobe XD', 'Prototyping']
                },
                {
                    _id: '3',
                    username: 'Mike Chen',
                    profilePic: { url: 'https://picsum.photos/100/100?random=3' },
                    title: 'Mobile App Developer',
                    location: 'Austin, TX',
                    averageRating: 4.7,
                    completedJobs: 156,
                    isVerified: false,
                    skills: ['React Native', 'Flutter', 'iOS']
                }
            ];
            
            setJobProviders(mockJobProviders);
            setIsLoading(false);
        }, 1500);
    }, []);

    const handleProfileClick = (id: string) => {
        router.push(`/dashboard/job-seeker/profile/${id}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full max-w-md lg:max-w-7xl mx-auto px-4 pb-20">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Left Sidebar - Hidden on mobile, visible on desktop */}
                    <LeftSideSeeker />
                    
                    {/* Main Content */}
                    <div className="lg:col-span-6 py-6">
                        {/* Back button */}
                        <div className="mb-6">
                            <button 
                                onClick={() => router.push('/dashboard/job-seeker')}
                                className="flex items-center gap-2 mb-4 p-2 rounded-lg transition-colors"
                            >
                                <ChevronLeft size={24} className="text-gray-600" />
                                <h1 className="text-xl font-bold text-gray-900">Top Buyers</h1>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="pb-20">
                            {isLoading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3, 4, 5].map((item) => (
                                        <PeopleLoader key={item} />
                                    ))}
                                </div>
                            ) : (
                                <>
                                    {jobProviders.length === 0 ? (
                                        <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                                            <div className="text-4xl mb-4">👥</div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                                No Job Providers Found
                                            </h3>
                                            <p className="text-gray-600">
                                                Check back later for top buyers in your area
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {jobProviders.map((provider) => (
                                                <PeopleCard
                                                    key={provider._id}
                                                    data={provider}
                                                    onClick={() => handleProfileClick(provider._id)}
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
                            {/* Top Buyers Stats */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4">Top Buyers</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Buyers</span>
                                        <span className="font-bold text-primary">{jobProviders.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Verified</span>
                                        <span className="font-bold text-green-600">
                                            {jobProviders.filter(p => p.isVerified).length}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Avg Rating</span>
                                        <span className="font-bold text-yellow-600">
                                            {jobProviders.length > 0 
                                                ? (jobProviders.reduce((acc, p) => acc + p.averageRating, 0) / jobProviders.length).toFixed(1)
                                                : '0.0'
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Filter Options */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4">Filters</h3>
                                <div className="space-y-3">
                                    <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                        <span className="text-gray-700">Verified Only</span>
                                    </button>
                                    <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                        <span className="text-gray-700">High Rated (4.5+)</span>
                                    </button>
                                    <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                        <span className="text-gray-700">Most Jobs</span>
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


"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Loader from '@/components/global/Loader';
import LeftSideSeeker from '@/components/ui/LeftSideSeeker';
import { MotivationalQuotes } from '@/components/ui/MotivationalQuotes';

interface Gig {
    _id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    images: string[];
}

export default function ProfilePageSeeker() {
    const router = useRouter();
    const { userData, isLoading, isError } = useAuth();
    console.log(userData);
    const [currentGigIndex, setCurrentGigIndex] = useState(0);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    // Mock gigs data
    const [gigs] = useState<Gig[]>([
        {
            _id: '1',
            title: 'Build Modern Website',
            description: 'Create a responsive website using React and Tailwind CSS',
            price: 15000,
            category: 'Web Development',
            images: ['/images/gig1.jpg']
        },
        {
            _id: '2',
            title: 'Mobile App Development',
            description: 'Develop a cross-platform mobile app using React Native',
            price: 25000,
            category: 'Mobile Development',
            images: ['/images/gig2.jpg']
        }
    ]);

    const handleImagePicker = () => {
        console.log('Image picker opened');
    };

    const handleNextGig = () => {
        if (currentGigIndex < gigs.length - 1) {
            setCurrentGigIndex(currentGigIndex + 1);
        } else {
            setCurrentGigIndex(0);
        }
    };

    if (isLoading) return <Loader />;
    if (isError) return <p>Error fetching user data</p>;
    if (!userData) return <p>No user data found</p>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full max-w-md lg:max-w-7xl mx-auto px-4 pb-20">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Left Sidebar - Hidden on mobile, visible on desktop */}
                    <LeftSideSeeker />

                    {/* Main Content */}
                    <div className="lg:col-span-6 py-6">
                        {/* Back Button */}
                        <button
                            onClick={() => router.push('/dashboard/job-seeker')}
                            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors lg:hidden"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        {/* Profile Header */}
                        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                            <div className="flex flex-col md:flex-row gap-6  items-start">
                                {/* Profile Picture */}
                                <div className="relative">
                                    {isUploadingImage ? (
                                        <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse border-2 border-primary"></div>
                                    ) : (
                                        <div className="relative">
                                            <img
                                                src={userData.profilePic?.url || "https://picsum.photos/600/400?random=6"}
                                                alt="Profile"
                                                width={96}
                                                height={96}
                                                className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                                            />
                                            <button
                                                onClick={handleImagePicker}
                                                className="absolute bottom-[20px] -right-1 bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Profile Details */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h1 className="text-2xl font-bold text-gray-900">{userData.username}</h1>
                                        {userData.isDocumentVerified === 'verified' && (
                                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>

                                    <p className="text-lg font-semibold text-gray-700 mb-2">{userData.title || 'Edit your title'}</p>

                                    <div className="flex items-center gap-1 mb-2">
                                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="font-semibold text-gray-900">0.0</span>
                                    </div>

                                    <p className="text-gray-600 mb-3 leading-relaxed">{userData.bio || 'Edit your bio'}</p>

                                    <div className="flex items-center gap-1 text-gray-600">
                                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>{userData.location || 'Edit your location'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3 mt-6">
                                <button onClick={() => router.push("/dashboard/job-seeker/profile/edit-profile")} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                    Edit Profile
                                </button>
                                <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                                    Share Profile
                                </button>
                                <button className="flex items-center gap-2 bg-primary text-white px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* About Me Section */}
                        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">About me</h2>
                            {userData.about_me ? (
                                <p className="text-gray-700 leading-relaxed mb-4">{userData.about_me}</p>
                            ) : (
                                <p className="text-red-500 text-center py-4 font-medium">
                                    Complete your profile to unlock more job opportunities and increase your chances of getting hired. Click on &quot;Edit Profile&quot; now to get started!
                                </p>
                            )}

                            <div className="border border-red-500 rounded-lg p-3 inline-block">
                                <p className="text-gray-700">{userData.email}</p>
                            </div>
                        </div>

                        {/* Skills Section */}
                        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
                            {userData.skills && userData.skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {userData.skills.map((skill: string, index: number) => (
                                        <span
                                            key={index}
                                            className="border border-primary text-gray-700 px-3 py-1 rounded-lg text-sm"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-red-500 text-center py-4 font-medium">
                                    Skills are very important to get a job recommendation. Just click on the &quot;Edit Profile&quot; button to add your skills.
                                </p>
                            )}
                        </div>

                        {/* My Gigs Section */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">My Gigs</h2>
                            {gigs.length > 0 ? (
                                <div>
                                    <div className="border rounded-xl p-4 mb-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-lg font-semibold text-gray-900">{gigs[currentGigIndex].title}</h3>
                                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                                                ₹{gigs[currentGigIndex].price.toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mb-3">{gigs[currentGigIndex].description}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                                {gigs[currentGigIndex].category}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {currentGigIndex + 1} of {gigs.length}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleNextGig}
                                        className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            ) : (
                                <p className="text-red-500 font-bold text-center py-4">
                                    No Gigs available
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar - Hidden on mobile, visible on desktop */}
                    <div className="hidden lg:block lg:col-span-3 py-6">
                        <MotivationalQuotes />
                    </div>
                </div>
            </div>
        </div>
    );
}

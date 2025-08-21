
"use client";

import { useState} from 'react';
import LeftSideProvider from '@/components/ui/LeftSideProvider';
import { GigCardProvider } from '@/components/gig/GigCardProvider';
import { useAllGigs } from '@/hooks/gigs/useAllGigs';
import { useNearbyGigs } from '@/hooks/gigs/useNearbyGigs';
import { useUserLocation } from '@/hooks/useUserLocation';
import { GigI } from '@/types/gig';
import RefreshingButton from '@/components/ui/RefreshingButton';
import Link from 'next/link';

function JobProviderDashboard() {
    const [isPopular, setIsPopular] = useState(true);

    // Get user location for nearby gigs
    const { latitude, longitude } = useUserLocation();

    // Fetch all gigs for browse tab
    const { gigs: allGigs, totalGigs, isLoading: isLoadingAllGigs, mutate: allGigsMutate } = useAllGigs(1, 10);

    // Fetch nearby gigs for nearby tab
    const { gigs: nearbyGigsData, isLoading: isLoadingNearbyGigs, mutate: nearbyGigsMutate } = useNearbyGigs(
        latitude || undefined,
        longitude || undefined
    );

    const setPopularTrueFunction = () => setIsPopular(true);
    const setPopularFalseFunction = () => setIsPopular(false);

    // Determine which gigs to show based on active tab
    const currentGigs = isPopular ? allGigs : nearbyGigsData;
    const currentLoading = isPopular ? isLoadingAllGigs : isLoadingNearbyGigs;

    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            if (isPopular) {
                await allGigsMutate();
            } else {
                await nearbyGigsMutate();
            }
        } catch (error) {
            console.error('Failed to refresh gigs:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full max-w-md lg:max-w-7xl mx-auto px-4 pb-20">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    <LeftSideProvider />
                    {/* Main Content */}
                    <div className="lg:col-span-6 py-6">
                        {/* Header Section */}
                        <div className="mb-6">
                            <div className="text-center lg:text-left mb-6">
                                <h2 className="text-gray-500 text-lg font-semibold mb-1">Discover</h2>
                                <h1 className="floating-animation text-2xl lg:text-3xl font-bold text-gray-900">
                                    services and freelancers
                                </h1>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="bg-white rounded-xl p-1 mb-6 shadow-sm">
                            <div className="flex">
                                <button
                                    onClick={setPopularTrueFunction}
                                    className={`flex-1 py-3 px-4 text-center font-bold text-sm rounded-lg transition-all ${isPopular
                                        ? 'bg-primary text-white shadow-sm border-b-2 border-primary'
                                        : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                >
                                    Browse Gigs
                                </button>
                                <button
                                    onClick={setPopularFalseFunction}
                                    className={`flex-1 py-3 px-4 text-center font-bold text-sm rounded-lg transition-all ${!isPopular
                                        ? 'bg-primary text-white shadow-sm border-b-2 border-primary'
                                        : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                >
                                    Near by Gigs
                                </button>
                            </div>
                        </div>

                        <div className='mb-4 flex items-center justify-end'>
                            <RefreshingButton
                                handleRefresh={handleRefresh}
                                isRefreshing={isRefreshing}
                                isLoading={isLoadingAllGigs}
                            />
                        </div>

                        {/* Content */}
                        <div className="min-h-[60vh]">
                            {currentLoading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3, 4, 5].map((item) => (
                                        <div key={item} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                                            <div className="flex items-start gap-4">
                                                <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                                                <div className="flex-1">
                                                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                                    <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
                                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    {currentGigs.length === 0 ? (
                                        <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                                            <div className="text-4xl mb-4">📋</div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                                {isPopular ? 'No Gigs available' : 'No near by Gigs available'}
                                            </h3>
                                            <p className="text-gray-600 mb-6">
                                                {isPopular ? 'Post your first gig to get started' : 'Enable location to find gigs in your area'}
                                            </p>
                                            <Link
                                                href={'/dashboard/job-provider/explore'}
                                                className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                                            >
                                                Go To Explore
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {currentGigs.map((gig: GigI) => (
                                                <Link
                                                    key={gig._id}
                                                    href={`/dashboard/job-provider/gig/${gig._id}`}
                                                >
                                                    <GigCardProvider
                                                        gig={gig}

                                                    />
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="hidden lg:block lg:col-span-3 py-6">
                        <div className="sticky top-6 space-y-6">
                            {/* Quick Actions */}

                            {/* Stats */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4">Gigs Stats</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Gigs</span>
                                        <span className="font-bold text-primary">{totalGigs}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Near You</span>
                                        <span className="font-bold text-green-600">{nearbyGigsData?.length || 0}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Tips */}
                            <div className="bg-gradient-to-br from-primary/10 to-green-100 rounded-xl p-6">
                                <h3 className="font-bold text-gray-900 mb-2">💡 Pro Tip</h3>
                                <p className="text-sm text-gray-700 mb-3">
                                    Add detailed descriptions and fair pricing to attract quality freelancers!
                                </p>
                                <button className="text-primary font-semibold text-sm hover:text-primary/80">
                                    Learn More →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>




        </div>
    );
}

export default JobProviderDashboard;

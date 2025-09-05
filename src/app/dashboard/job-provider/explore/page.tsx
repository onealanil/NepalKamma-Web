
"use client";

import { useState } from 'react';
import { Search, Filter, Star } from 'lucide-react';
import LeftSideProvider from '@/components/ui/LeftSideProvider';
import { GigCardProvider } from '@/components/gig/GigCardProvider';
import { useSearchGigs, GigSearchParams } from '@/hooks/gigs/useSearchGigs';
import { useUserLocation } from '@/hooks/useUserLocation';
import { GigI } from '@/types/gig';
import RefreshingButton from '@/components/ui/RefreshingButton';
import Loader from '@/components/global/Loader';
import Link from 'next/link';
import { Skills_data } from '@/utils/data/data';

function JobProviderExplorePage() {
    const { latitude, longitude } = useUserLocation();

    const [searchText, setSearchText] = useState('');
    const [category, setCategory] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const searchParams: GigSearchParams = {
        text: searchText || undefined,
        category: category || undefined,
        lng: longitude || undefined,
        lat: latitude || undefined,
        sortByRating: sortBy === 'rating' || undefined,
        sortByPriceHighToLow: sortBy === 'priceHigh' || undefined,
        sortByPriceLowToHigh: sortBy === 'priceLow' || undefined,
        page: currentPage,
        limit: 5
    };


    // Fetch gigs based on search parameters
    const { gigs, totalGigs, totalPages, isLoading, isError, mutate } = useSearchGigs(searchParams);

    const handleSearch = () => {
        setCurrentPage(1);
    };

    const handleClearFilters = () => {
        setSearchText('');
        setCategory('');
        setSortBy('');
        setCurrentPage(1);
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await mutate();
        } catch (error) {
            console.error('Failed to refresh gigs:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    // Early return after all hooks are called
    if (!latitude || !longitude) {
        return <Loader />
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full max-w-md lg:max-w-7xl mx-auto px-4 pb-20">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Left Sidebar */}
                    <div className="hidden lg:block lg:col-span-3">
                        <LeftSideProvider />
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-9">
                        <div className="pt-6">
                            {/* Header */}
                            <div className="mb-6">
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">Explore Gigs</h1>
                                <p className="text-gray-600">Find the perfect gigs for your needs</p>
                            </div>

                            {/* Search Bar */}
                            <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Search for gigs..."
                                            value={searchText}
                                            onChange={(e) => setSearchText(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <button
                                        onClick={() => setIsFilterModalVisible(true)}
                                        className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <Filter className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <button
                                        onClick={handleSearch}
                                        className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                                    >
                                        Search
                                    </button>
                                </div>

                                {/* Quick Filters */}
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setSortBy(sortBy === 'rating' ? '' : 'rating')}
                                        className={`px-3 py-1 border border-black rounded-full text-sm font-medium transition-colors ${sortBy === 'rating'
                                            ? 'bg-primary text-white'
                                            : 'text-gray-700 '
                                            }`}
                                    >
                                        <Star className="w-4 h-4 inline mr-1" />
                                        Top Rated
                                    </button>
                                    <button
                                        onClick={() => setSortBy(sortBy === 'priceLow' ? '' : 'priceLow')}
                                        className={`px-3 py-1 border border-black rounded-full text-sm font-medium transition-colors ${sortBy === 'priceLow'
                                            ? 'bg-primary text-white'
                                            : 'text-gray-700 '
                                            }`}
                                    >
                                        Price: Low to High
                                    </button>
                                    <button
                                        onClick={() => setSortBy(sortBy === 'priceHigh' ? '' : 'priceHigh')}
                                        className={`px-3 py-1 border border-black rounded-full text-sm font-medium transition-colors ${sortBy === 'priceHigh'
                                            ? 'bg-primary text-white'
                                            : 'text-gray-700 '
                                            }`}
                                    >
                                        Price: High to Low
                                    </button>
                                    {(searchText || category || sortBy) && (
                                        <button
                                            onClick={handleClearFilters}
                                            className="px-3 py-1 rounded-full text-sm font-medium border border-black text-red-700 transition-colors"
                                        >
                                            Clear All
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className='mb-3 flex items-center justify-end'>
                                <RefreshingButton
                                    handleRefresh={handleRefresh}
                                    isRefreshing={isRefreshing}
                                    isLoading={isLoading}
                                />
                            </div>

                            {/* Results */}
                            <div className="mb-6">
                                {isLoading ? (
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
                                ) : isError ? (
                                    <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                                        <div className="text-4xl mb-4">⚠️</div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">Error Loading Gigs</h3>
                                        <p className="text-gray-600 mb-4">
                                            There was an error loading the gigs. Please try again.
                                        </p>
                                        <button
                                            onClick={handleSearch}
                                            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                ) : gigs.length === 0 ? (
                                    <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                                        <div className="text-4xl mb-4">🔍</div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">No Gigs Found</h3>
                                        <p className="text-gray-600 mb-4">
                                            {searchText || category
                                                ? "Try adjusting your search criteria or filters."
                                                : "No gigs are available at the moment."
                                            }
                                        </p>
                                        {(searchText || category || sortBy) && (
                                            <button
                                                onClick={handleClearFilters}
                                                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                                            >
                                                Clear Filters
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        {/* Results Header */}
                                        <div className="flex items-center justify-between mb-4">
                                            <p className="text-gray-600">
                                                Found {totalGigs} gig{totalGigs !== 1 ? 's' : ''}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Page {currentPage} of {totalPages}
                                            </p>
                                        </div>

                                        {/* Gigs List */}
                                        <div className="grid grid-cols-1 space-y-4">
                                            {gigs.map((gig: GigI) => (
                                                <Link href={`/dashboard/job-provider/gig/${gig._id}`}
                                                    key={gig._id}
                                                    // onClick={() => router.push(`/dashboard/job-provider/gig/${gig._id}`)}
                                                    className="cursor-pointer hover:shadow-md transition-shadow"
                                                >
                                                    <GigCardProvider gig={gig} />
                                                </Link>
                                            ))}
                                        </div>

                                        {/* Pagination */}
                                        {totalPages > 1 && (
                                            <div className="flex items-center justify-center gap-2 mt-8">
                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                    disabled={currentPage === 1}
                                                    className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Previous
                                                </button>

                                                {/* Page Numbers */}
                                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                    const pageNum = Math.max(1, currentPage - 2) + i;
                                                    if (pageNum > totalPages) return null;

                                                    return (
                                                        <button
                                                            key={pageNum}
                                                            onClick={() => setCurrentPage(pageNum)}
                                                            className={`px-4 py-2 rounded-lg font-medium ${pageNum === currentPage
                                                                ? 'bg-primary text-white'
                                                                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    );
                                                })}

                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                                    disabled={currentPage === totalPages}
                                                    className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Modal */}
            {isFilterModalVisible && (
                <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Filter Gigs</h3>
                            <button
                                onClick={() => setIsFilterModalVisible(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                >
                                    <option value="">All Categories</option>
                                    {Skills_data.map((cat) => (
                                        <option key={cat.id} value={cat.name}>
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Sort Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                >
                                    <option value="">Default</option>
                                    <option value="rating">Top Rated</option>
                                    <option value="priceLow">Price: Low to High</option>
                                    <option value="priceHigh">Price: High to Low</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleClearFilters}
                                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Clear All
                            </button>
                            <button
                                onClick={() => {
                                    setIsFilterModalVisible(false);
                                    handleSearch();
                                }}
                                className="flex-1 py-3 px-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default JobProviderExplorePage;

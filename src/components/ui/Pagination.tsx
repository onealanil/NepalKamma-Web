"use client";

import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalJobs: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    totalJobs,
    onPageChange,
    isLoading = false
}) => {
    // Generate page numbers to show
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            // Show all pages if total is less than max visible
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Show pages with ellipsis logic
            if (currentPage <= 3) {
                // Show first 3 pages + ellipsis + last page
                pages.push(1, 2, 3, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                // Show first page + ellipsis + last 3 pages
                pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
            } else {
                // Show first + ellipsis + current-1, current, current+1 + ellipsis + last
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        
        return pages;
    };

    const pageNumbers = getPageNumbers();

    const handlePrevious = () => {
        if (currentPage > 1 && !isLoading) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages && !isLoading) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePageClick = (page: number | string) => {
        if (typeof page === 'number' && page !== currentPage && !isLoading) {
            onPageChange(page);
        }
    };

    if (totalPages <= 1) {
        return null; // Don't show pagination if only 1 page
    }

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            {/* Jobs Info */}
            <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-600">
                    Showing <span className="font-semibold text-gray-900">{((currentPage - 1) * 5) + 1}</span> to{' '}
                    <span className="font-semibold text-gray-900">
                        {Math.min(currentPage * 5, totalJobs)}
                    </span> of{' '}
                    <span className="font-semibold text-gray-900">{totalJobs}</span> jobs
                </div>
                <div className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages}
                </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between">
                {/* Previous Button */}
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1 || isLoading}
                    className={`flex items-center gap-2 px-4 bg-primary py-2 rounded-lg font-medium transition-all ${
                        currentPage === 1 || isLoading
                            ? 'bg-gray-100 text-red cursor-not-allowed'
                            : 'bg-gray-100 text-white hover:bg-primary hover:text-white'
                    }`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                    {pageNumbers.map((page, index) => (
                        <React.Fragment key={index}>
                            {page === '...' ? (
                                <span className="px-3 py-2 text-gray-400">...</span>
                            ) : (
                                <button
                                    onClick={() => handlePageClick(page)}
                                    disabled={isLoading}
                                    className={`w-10 h-10 rounded-lg font-medium transition-all ${
                                        page === currentPage
                                            ? 'bg-primary text-white shadow-md'
                                            : isLoading
                                            ? 'bg-primary text-red cursor-not-allowed'
                                            : 'bg-primary text-white'
                                    }`}
                                >
                                    {page}
                                </button>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Next Button */}
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages || isLoading}
                    className={`flex items-center gap-2 px-4 py-2 bg-primary rounded-lg font-medium transition-all ${
                        currentPage === totalPages || isLoading
                            ? 'bg-gray-100 text-gary-400 cursor-not-allowed'
                            : 'bg-gray-100 text-white hover:bg-primary hover:text-white'
                    }`}
                >
                    Next
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Loading Indicator */}
            {isLoading && (
                <div className="mt-4 flex items-center justify-center">
                    <div className="flex items-center gap-2 text-primary">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        <span className="text-sm font-medium">Loading jobs...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pagination;

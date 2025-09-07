import { ChevronLeft, ChevronRight } from 'lucide-react';


export interface JobProviderPaginationInfo {
    currentPage: number;
    totalPages: number;
    totalJobProviders: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
}

export interface TopRatedJobProviderPaginationProps {
    pagination: JobProviderPaginationInfo;
    currentPage: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
}

export default function TopRatedJobProviderPagination({
    pagination,
    currentPage,
    onPageChange,
    isLoading = false
}: TopRatedJobProviderPaginationProps) {
    const { totalPages, hasNextPage, hasPrevPage, totalJobProviders } = pagination;

    if (totalPages <= 1) return null;

    const handlePrevious = () => {
        if (hasPrevPage && !isLoading) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (hasNextPage && !isLoading) {
            onPageChange(currentPage + 1);
        }
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            const start = Math.max(1, currentPage - 2);
            const end = Math.min(totalPages, start + maxVisiblePages - 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
        }

        return pages;
    };

    return (
        <div className="flex flex-col gap-4 z-50 items-center justify-between mt-6 pt-4 border-t border-black">
            <div className="text-sm text-gray-600">
                Showing page {currentPage} of {totalPages} ({totalJobProviders} total job providers)
            </div>

            <div className="flex items-center space-x-2">
                {/* Previous Button */}
                <button
                    onClick={handlePrevious}
                    disabled={!hasPrevPage || isLoading}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft size={16} className="mr-1" />
                    Previous
                </button>

                {/* Page Numbers */}
                <div className="flex space-x-1">
                    {getPageNumbers().map((page) => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            disabled={isLoading}
                            className={`px-3 py-2 text-sm font-medium rounded-md ${page === currentPage
                                    ? 'bg-primary text-white'
                                    : 'text-gray-700 border border-gray-300 hover:bg-gray-50'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                {/* Next Button */}
                <button
                    onClick={handleNext}
                    disabled={!hasNextPage || isLoading}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                    <ChevronRight size={16} className="ml-1" />
                </button>
            </div>
        </div>
    );
}
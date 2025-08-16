import useSWR from "swr";
import {
    fetchReviewsByProvider,
    fetchAllReviewsByProvider,
    calculateAverageRating,
    ReviewsResponse,
    PaginationInfo
} from "@/lib/review/review-api";
import { ReviewI } from "@/types/review";
import { useState } from "react";

/**
 * @function useReviews
 * @param providerId - Provider ID to fetch reviews for
 * @returns: {reviews: ReviewI[], averageRating: number, isLoading: boolean, isError: boolean, mutate: () => void}
 * @description: Hook for fetching all reviews for a specific provider (for backward compatibility)
 */
export const useReviews = (providerId?: string) => {
    const key = providerId ? `/review/getAllReviews/${providerId}` : null;

    const { data, error, isLoading, mutate: revalidate } = useSWR(
        key,
        async () => {
            if (!providerId) return null;
            const response = await fetchAllReviewsByProvider(providerId);
            return response.success ? response.data : [];
        },
        {
            revalidateOnFocus: false,
            refreshInterval: 0, // Don't auto-refresh reviews
            errorRetryCount: 3,
            errorRetryInterval: 5000
        }
    );

    const reviews: ReviewI[] = data || [];
    const averageRating = calculateAverageRating(reviews);

    return {
        reviews,
        averageRating,
        isLoading,
        isError: !!error,
        mutate: revalidate,
    };
};

/**
 * @function usePaginatedReviews
 * @param providerId - Provider ID to fetch reviews for
 * @param initialPage - Initial page number (default: 1)
 * @returns: {reviews: ReviewI[], pagination: PaginationInfo, averageRating: number, isLoading: boolean, isError: boolean, currentPage: number, setCurrentPage: function, mutate: function}
 * @description: Hook for fetching paginated reviews for a specific provider
 */
export const usePaginatedReviews = (providerId?: string, initialPage: number = 1) => {
    const [currentPage, setCurrentPage] = useState(initialPage);

    const key = providerId ? `/review/getReviewByProvider/${providerId}?page=${currentPage}` : null;

    const { data, error, isLoading, mutate: revalidate } = useSWR(
        key,
        async () => {
            if (!providerId) return null;
            const response = await fetchReviewsByProvider(providerId, currentPage);
            return response.success ? response.data : null;
        },
        {
            revalidateOnFocus: false,
            refreshInterval: 0,
            errorRetryCount: 3,
            errorRetryInterval: 5000
        }
    );

    // Fetch all reviews for average rating calculation
    const { data: allReviewsData } = useSWR(
        providerId ? `/review/getAllReviews/${providerId}` : null,
        async () => {
            if (!providerId) return null;
            const response = await fetchAllReviewsByProvider(providerId);
            return response.success ? response.data : [];
        },
        {
            revalidateOnFocus: false,
            refreshInterval: 0,
            errorRetryCount: 3,
            errorRetryInterval: 5000
        }
    );

    const reviews: ReviewI[] = data?.reviews || [];
    const pagination: PaginationInfo = data?.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalReviews: 0,
        hasNextPage: false,
        hasPrevPage: false,
        limit: 5
    };
    const averageRating = calculateAverageRating(allReviewsData || []);

    return {
        reviews,
        pagination,
        averageRating,
        isLoading,
        isError: !!error,
        currentPage,
        setCurrentPage,
        mutate: revalidate,
    };
};

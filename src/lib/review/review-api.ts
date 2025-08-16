import axiosInstance from "../axios";
import { handleApiError } from "../job/job-api";
import { ApiResponse } from "@/types/job-provider/job-api";
import { ReviewI } from "@/types/review";

/**
 * @interface PaginationInfo
 * @description Interface for pagination information
 */
export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalReviews: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
}

/**
 * @interface ReviewsResponse
 * @description Interface for paginated reviews response
 */
export interface ReviewsResponse {
    reviews: ReviewI[];
    pagination: PaginationInfo;
}

/**
 * @interface CreateReviewData
 * @description Interface for creating a new review
 */
export interface CreateReviewData {
    reviewedBy: string;
    reviewedTo: string;
    review: string;
    rating: number;
}

/**
 * @function createReview
 * @description Creates a new review for a user
 * @param reviewData - Review data to be created
 * @returns Promise<ApiResponse> - Response from the server
 * @route POST /review/createReview
 */
export async function createReview(reviewData: CreateReviewData): Promise<ApiResponse> {
    try {
        const response = await axiosInstance.post(`/review/createReview`, reviewData);
        return {
            success: true,
            data: response.data,
            message: "Review created successfully"
        };
    } catch (error: unknown) {
        return handleApiError(error, "Failed to create review. Please try again.");
    }
}

/**
 * @function fetchReviewsByProvider
 * @description Fetches paginated reviews for a specific provider
 * @param providerId - Provider ID to get reviews for
 * @param page - Page number (default: 1)
 * @returns Promise<ApiResponse> - Response from the server with pagination
 * @route GET /review/getReviewByProvider/:id?page=X
 */
export async function fetchReviewsByProvider(providerId: string, page: number = 1): Promise<ApiResponse> {
    try {
        if (!providerId) {
            throw new Error("Provider ID is required");
        }

        const response = await axiosInstance.get(`/review/getReviewByProvider/${providerId}?page=${page}`);
        return {
            success: true,
            data: response.data,
            message: "Reviews fetched successfully"
        };
    } catch (error: unknown) {
        return handleApiError(error, "Failed to fetch reviews. Please try again.");
    }
}

/**
 * @function fetchAllReviewsByProvider
 * @description Fetches all reviews for a specific provider (for calculating average rating)
 * @param providerId - Provider ID to get reviews for
 * @returns Promise<ApiResponse> - Response from the server with all reviews
 * @route GET /review/getReviewByProvider/:id (without pagination)
 */
export async function fetchAllReviewsByProvider(providerId: string): Promise<ApiResponse> {
    try {
        if (!providerId) {
            throw new Error("Provider ID is required");
        }

        // Fetch a large number to get all reviews for average calculation
        const response = await axiosInstance.get(`/review/getReviewByProvider/${providerId}?page=1&limit=1000`);
        return {
            success: true,
            data: response.data.reviews || [], // Extract just the reviews array
            message: "All reviews fetched successfully"
        };
    } catch (error: unknown) {
        return handleApiError(error, "Failed to fetch all reviews. Please try again.");
    }
}

/**
 * @function calculateAverageRating
 * @description Calculates the average rating from an array of reviews
 * @param reviews - Array of reviews
 * @returns number - Average rating
 */
export function calculateAverageRating(reviews: ReviewI[]): number {
    if (!reviews || reviews.length === 0) return 0;

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((totalRating / reviews.length) * 10) / 10; // Round to 1 decimal place
}

import { ApiResponse } from "@/types/job-provider/job-api";
import axiosInstance from "../axios";
import { handleApiError } from "../job/job-api";

// --------------------------------------- Top rated provider and seeker --------------------------------------------------

export async function fetchTopRatedProvider() {
  try {
    const response = await axiosInstance.get(`/user/top-rated-job-provider`);
    return {
      success: true,
      data: response.data,
      message: "Top rated job providers fetched successfully",
    };
  } catch (error: unknown) {
    return handleApiError(
      error,
      "Failed to fetch top rated job providers. Please try again."
    );
  }
}

export const fetchTopRatedSeeker = async (page: number = 1): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.get(`/user/top-rated-job-seeker?page=${page}`);
    return {
      success: true,
      data: response.data,
      pagination: response.data,
    };
  } catch (error: unknown) {
    return handleApiError(
      error,
      "Failed to fetch top rated job seekers. Please try again."
    );
  }
}

export const fetchNearbyProviders = async (page: number = 1, latitude?: number, longitude?: number): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.get(`/user/getNearbyJobProvider/${latitude}/${longitude}?page=${page}`);
    console.log("Nearby Providers Response:", response.data);
    return {
      success: true,
      data: response.data,
      pagination: response.data,
    };
  } catch (error: unknown) {
    return handleApiError(
      error,
      "Failed to fetch top rated job seekers. Please try again."
    );
  }
}

// --------------------------------------- Single user provider and seeker --------------------------------------------------

/**
 * @function fetchSingleUserProvider
 * @description Fetches a single user provider and their jobs by user ID
 * @param userId - User ID to fetch
 * @returns Promise with user data and their jobs
 * @route GET /user/provider/:id
 */
export async function fetchSingleUserProvider(userId: string) {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const response = await axiosInstance.get(`/user/user/provider/${userId}`);
    return {
      success: true,
      data: response.data,
      message: "User provider fetched successfully",
    };
  } catch (error: unknown) {
    return handleApiError(
      error,
      "Failed to fetch user provider. Please try again."
    );
  }
}

/**
 * @function fetchSingleUserSeeker
 * @description Fetches a single user seeker and their gigs by user ID
 * @param userId - User ID to fetch
 * @returns Promise with user data and their gigs
 * @route GET /user/seeker/:id
 */
export async function fetchSingleUserSeeker(userId: string) {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const response = await axiosInstance.get(`/user/user/seeker/${userId}`);
    return {
      success: true,
      data: response.data,
      message: "User provider fetched successfully",
    };
  } catch (error: unknown) {
    return handleApiError(
      error,
      "Failed to fetch user provider. Please try again."
    );
  }
}

import axiosInstance from "../axios";
import { handleApiError } from "../job/job-api";

// --------------------------------------- Top rated provider --------------------------------------------------

export async function fetchTopRatedProvider() {
  try {
    const response = await axiosInstance.get(`/user/top-rated-job-provider`);
    console.log("this is response", response);
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

// --------------------------------------- Single user provider --------------------------------------------------

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

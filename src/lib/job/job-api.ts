
import { JobI } from "@/types/job";
import axiosInstance from "../axios";
import { ErrorToast } from "@/components/ui/Toast";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/job-provider/job-api";


/**
 * @function handleApiError
 * @description Centralized error handling for API calls
 * @param error - The error object
 * @param defaultMessage - Default error message to show
 * @returns Formatted error response
 */
function handleApiError(error: unknown, defaultMessage: string): ApiResponse {
    console.error('API Error:', error);

    if (error instanceof AxiosError) {
        const message = error.response?.data?.message || error.message || defaultMessage;
        ErrorToast(message);
        return {
            success: false,
            error: message,
            data: null
        };
    }

    ErrorToast(defaultMessage);
    return {
        success: false,
        error: defaultMessage,
        data: null
    };
}

// -------------------------------------------------- for job provider (who posted the job) -------------------------------------------

/**
 * @function createJob
 * @description Creates a new job
 * @param job - Job data
 * @returns Promise<ApiResponse> - Response from the server
 * @route POST /job/createJob
 */
export async function createJob(job: JobI): Promise<ApiResponse> {
    try {
        const response = await axiosInstance.post(`/job/createJob`, job);
        return {
            success: true,
            data: response.data,
            message: "Job created successfully"
        };
    } catch (error: unknown) {
        return handleApiError(error, "Failed to create job. Please try again.");
    }
}

/**
 * @function fetchUserJobs
 * @description Fetches jobs for a specific user
 * @param userId - User ID
 * @returns Promise<ApiResponse> - Response from the server
 * @route GET /job/getSingleUserJob/:userId
 */
export async function fetchUserJobs(userId: string): Promise<ApiResponse> {
    try {
        if (!userId) {
            throw new Error("User ID is required");
        }

        const response = await axiosInstance.get(`/job/getSingleUserJob/${userId}`);
        return {
            success: true,
            data: response.data,
            message: "Jobs fetched successfully"
        };
    } catch (error: unknown) {
        return handleApiError(error, "Failed to fetch jobs. Please try again.");
    }
}

/**
 * @function deleteJob
 * @description Deletes a job
 * @param jobId - Job ID
 * @returns Promise<ApiResponse> - Response from the server
 * @route DELETE /job/deleteJob/:jobId
 */
export async function deleteJob(jobId: string): Promise<ApiResponse> {
    try {
        if (!jobId) {
            throw new Error("Job ID is required");
        }

        const response = await axiosInstance.delete(`/job/deleteJob/${jobId}`);
        return {
            success: true,
            data: response.data,
            message: "Job deleted successfully"
        };
    } catch (error: unknown) {
        return handleApiError(error, "Failed to delete job. Please try again.");
    }
}

/**
 * @function updateJob
 * @description Updates a job's status and assignment
 * @param jobId - Job ID
 * @param jobData - Updated job data
 * @returns Promise<ApiResponse> - Response from the server
 * @route PUT /job/updateJobStatus/:jobId
 */
export async function updateJob(
    jobId: string,
    jobData: { job_status: string, assignedTo: string }
): Promise<ApiResponse> {
    try {
        if (!jobId) {
            throw new Error("Job ID is required");
        }

        if (!jobData.job_status) {
            throw new Error("Job status is required");
        }

        if (!jobData.assignedTo) {
            throw new Error("Assigned user is required");
        }

        const response = await axiosInstance.put(`/job/updateJobStatus/${jobId}`, jobData);
        return {
            success: true,
            data: response.data,
            message: "Job updated successfully"
        };
    } catch (error: unknown) {
        return handleApiError(error, "Failed to update job. Please try again.");
    }
}

/**
 * @function searchUser
 * @description Searches for users by username
 * @param username - Username to search for
 * @returns Promise<ApiResponse> - Response from the server
 * @route GET /user/search-user/:username
 */
export async function searchUser(username: string): Promise<ApiResponse> {
    try {
        if (!username || username.trim() === "") {
            throw new Error("Username is required");
        }

        const response = await axiosInstance.get(`/user/search-user/${username.trim()}`);
        return {
            success: true,
            data: response.data,
            message: "User search completed"
        };
    } catch (error: unknown) {
        return handleApiError(error, "Failed to search users. Please try again.");
    }
}


// ---------------------------------------------- for job-seeker (to fetch all the available jobs)---------------------------------------------

/**
 * @function fetchAllJobs
 * @description Fetches all the jobs
 * @returns Promise<ApiResponse> - Response from the server
 * @route GET /job
 */
export async function fetchAllJobs(): Promise<ApiResponse> {
    try {
        const response = await axiosInstance.get(`/job`);
        return {
            success: true,
            data: response.data,
            message: "Jobs fetched successfully"
        };
    }
    catch (error: unknown) {
        return handleApiError(error, "Failed to fetch jobs. Please try again.");
    }
}

/**
 * @function fetchJobById
 * @description Fetches a single job by ID
 * @param jobId - Job ID
 * @returns Promise<ApiResponse> - Response from the server
 * @route GET /job/:jobId
 */
export async function fetchJobById(jobId: string): Promise<ApiResponse> {
    try {
        if (!jobId) {
            throw new Error("Job ID is required");
        }

        const response = await axiosInstance.get(`/job/${jobId}`);
        return {
            success: true,
            data: response.data,
            message: "Job fetched successfully"
        };
    }
    catch (error: unknown) {
        return handleApiError(error, "Failed to fetch job details. Please try again.");
    }
}

/**
 * @function applyToJob
 * @description Apply to a specific job
 * @param jobId - Job ID
 * @returns Promise<ApiResponse> - Response from the server
 * @route POST /job/apply/:jobId
 */
export async function applyToJob(jobId: string): Promise<ApiResponse> {
    try {
        if (!jobId) {
            throw new Error("Job ID is required");
        }

        const response = await axiosInstance.post(`/job/apply/${jobId}`);
        return {
            success: true,
            data: response.data,
            message: "Application submitted successfully"
        };
    }
    catch (error: unknown) {
        return handleApiError(error, "Failed to apply to job. Please try again.");
    }
}

/**
 * @function saveJob
 * @description Save/bookmark a job
 * @param jobId - Job ID
 * @returns Promise<ApiResponse> - Response from the server
 * @route POST /job/save/:jobId
 */
export async function saveJob(jobId: string): Promise<ApiResponse> {
    try {
        if (!jobId) {
            throw new Error("Job ID is required");
        }

        const response = await axiosInstance.post(`/job/save/${jobId}`);
        return {
            success: true,
            data: response.data,
            message: "Job saved successfully"
        };
    }
    catch (error: unknown) {
        return handleApiError(error, "Failed to save job. Please try again.");
    }
}

/**
 * @function unsaveJob
 * @description Remove job from saved/bookmarks
 * @param jobId - Job ID
 * @returns Promise<ApiResponse> - Response from the server
 * @route DELETE /job/save/:jobId
 */
export async function unsaveJob(jobId: string): Promise<ApiResponse> {
    try {
        if (!jobId) {
            throw new Error("Job ID is required");
        }

        const response = await axiosInstance.delete(`/job/save/${jobId}`);
        return {
            success: true,
            data: response.data,
            message: "Job removed from saved list"
        };
    }
    catch (error: unknown) {
        return handleApiError(error, "Failed to unsave job. Please try again.");
    }
}

/**
 * @function fetchNearbyJobs
 * @description Fetches nearby jobs based on user's location
 * @param latitude - User's latitude
 * @param longitude - User's longitude
 */

export async function fetchNearbyJobs(
    latitude: number,
    longitude: number,
): Promise<ApiResponse> {
    try {
        if (!latitude || !longitude) {
            throw new Error("Latitude and longitude are required");
        }
        const response = await axiosInstance.get(`/job/getNearbyJob/${latitude}/${longitude}`);
        return {
            success: true,
            data: response.data.nearBy || [], // Extract the nearBy array
            message: "Nearby jobs fetched successfully"
        };
    }
    catch (error: unknown) {
        return handleApiError(error, "Failed to fetch nearby jobs. Please try again.");
    }
}

/**
 * @function fetchRecommendedJobs
 * @description Fetches recommended jobs based on user's profile
 * @param userId - User ID
 * @returns Promise<ApiResponse> - Response from the server
 * @route GET /job/getRecommendedJob
 */
export async function fetchRecommendedJobs(): Promise<ApiResponse> {
    try {
        const response = await axiosInstance.get(`/job/getRecommendedJob`);
        return {
            success: true,
            data: response.data.recommendedJobs || [],
            message: response.data.message || "Recommended jobs fetched successfully",
            meta: {
                totalCount: response.data.totalCount || 0,
                algorithm: response.data.algorithm,
                generatedAt: response.data.generatedAt
            }
        };
    }
    catch (error: unknown) {
        return handleApiError(error, "Failed to fetch recommended jobs. Please try again.");
    }
}

/**
 * @function fetchRecentJobs
 * @description Fetches recent jobs based on most recently posted jobs
 * @returns Promise<ApiResponse> - Response from the server
 * @route GET /job/getRecentJob
 */
export async function fetchRecentJobs(): Promise<ApiResponse> {
    try {
        const response = await axiosInstance.get(`/job/getRecentJob`);
        return {
            success: true,
            data: response.data.jobs || [],
            message: response.data.message || "Recent jobs fetched successfully"
        };
    }
    catch (error: unknown) {
        return handleApiError(error, "Failed to fetch recent jobs. Please try again.");
    }
}



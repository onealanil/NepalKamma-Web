import { ErrorToast } from "@/components/ui/Toast";
import { GigI } from "@/types/gig";
import axiosInstance from "../axios";
import { handleApiError } from "../job/job-api";
import { ApiResponse } from "@/types/job-provider/job-api";
import clientLogger from "@/utils/logger";


/**
 * @function uploadGigImages
 * @param formData Images form data
 * @returns the response from the server
 * @route POST /gig/upload-photo
 */
export async function uploadGigImages(formData: FormData) {
    try {
        const response = await axiosInstance.post(`/gig/upload-photo`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    }
    catch (error: unknown) {
        ErrorToast("Something went wrong while uploading your images!")
        clientLogger.error("Somethine went wrong while uploading your images, ", error);
    }
}

/**
 * @function createGig
 * @description this function helps to create the gig
 * @param id:string Id of the user
 * @param gig: Gigdata of the user
 * @returns Response from the server
 * @route PUT /gig/creategig/{id}
*/
export async function createGig(id: string, gig: GigI) {
    try {
        const response = await axiosInstance.put(`/gig/creategig/${id}`, gig);
        return response.data;
    }
    catch (error: unknown) {
        ErrorToast("Something Went wrong while Creating your gig!");
        clientLogger.error("Something went wrong while creating your gig: ", error)
    }
}

/**
 * @function fetchUserGigs
 * @description This function is used to fetch the gigs of the user
 * @returns Response from the server
 * @route GET /gig/my-gigs
 */
export async function fetchUserGigs(id: string) {
    try {
        const response = await axiosInstance.get(`/gig/getSingleUserGig/${id}`);
        return response.data;
    }
    catch (error: unknown) {
        ErrorToast("Something Went wrong while fetching your gigs!");
        clientLogger.error("Something went wrong while fetching your gigs: ", error);
    }
}

/**
 * @param id Gig ID
 * @description This function is used to delete the gig
 * @route DELETE /gig/deleteUsergig/:id
 * @returns Response from the server
 */
export async function deleteGig(id: string) {
    try {
        const res = await axiosInstance.delete(`/gig/deleteUsergig/${id}`);
        return res.data;
    }
    catch (error: unknown) {
        ErrorToast("Something Went wrong while fetching your gigs!");
        clientLogger.error("Somethign went wrong while fetching your gigs: ", error);
    }
}

// -------------------------------------------------- for job provider (gig browsing) -------------------------------------------

/**
 * @function fetchAllGigs
 * @description Fetches all gigs with pagination
 * @param page - Page number (default: 1)
 * @param limit - Number of gigs per page (default: 10)
 * @returns Promise<ApiResponse> - Response from the server
 * @route GET /gig?page=X&limit=Y
 */
export async function fetchAllGigs(page: number = 1, limit: number = 10): Promise<ApiResponse> {
    try {
        const response = await axiosInstance.get(`/gig?page=${page}&limit=${limit}`);
        return {
            success: true,
            data: response.data,
            message: "Gigs fetched successfully"
        };
    } catch (error: unknown) {
        clientLogger.error("Failed to fetch gigs: ", error);
        return handleApiError(error, "Failed to fetch gigs. Please try again.");
    }
}

/**
 * @function fetchNearbyGigs
 * @description Fetches nearby gigs based on user location
 * @param latitude - User's latitude
 * @param longitude - User's longitude
 * @returns Promise<ApiResponse> - Response from the server
 * @route GET /gig/getNearbyGig/:latitude/:longitude
 */
export async function fetchNearbyGigs(latitude: number, longitude: number): Promise<ApiResponse> {
    try {
        if (!latitude || !longitude) {
            throw new Error("Latitude and longitude are required");
        }
        const response = await axiosInstance.get(`/gig/getNearbyGig/${latitude}/${longitude}`);
        return {
            success: true,
            data: response.data.nearByGigs || [],
            message: "Nearby gigs fetched successfully"
        };
    } catch (error: unknown) {
        clientLogger.error("Failed to fetch nearby gigs: ", error);
        return handleApiError(error, "Failed to fetch nearby gigs. Please try again.");
    }
}

/**
 * @function searchGigs
 * @description Search gigs based on various criteria
 * @param searchParams - Search parameters object
 * @returns Promise<ApiResponse> - Response from the server
 * @route GET /gig/searchgig
 */
export interface GigSearchParams {
    text?: string;
    category?: string;
    lng?: number;
    lat?: number;
    distance?: number;
    sortByRating?: boolean;
    sortByPriceHighToLow?: boolean;
    sortByPriceLowToHigh?: boolean;
    page?: number;
    limit?: number;
}

export async function searchGigs(searchParams: GigSearchParams): Promise<ApiResponse> {
    try {
        const queryParams = new URLSearchParams();

        Object.entries(searchParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, value.toString());
            }
        });
        const response = await axiosInstance.get(`/gig/searchgig?${queryParams.toString()}`);
        return {
            success: true,
            data: response.data,
            message: "Gigs searched successfully"
        };
    } catch (error: unknown) {
        return handleApiError(error, "Failed to search gigs. Please try again.");
    }
}

/**
 * @function fetchGigById
 * @description Fetches a single gig by ID
 * @param gigId - Gig ID
 * @returns Promise<ApiResponse> - Response from the server
 * @route GET /gig/:gigId
 */
export async function fetchGigById(gigId: string): Promise<ApiResponse> {
    try {
        if (!gigId) {
            throw new Error("Gig ID is required");
        }

        const response = await axiosInstance.get(`/gig/${gigId}`);
        return {
            success: true,
            data: response.data,
            message: "Gig fetched successfully"
        };
    } catch (error: unknown) {
        return handleApiError(error, "Failed to fetch gig details. Please try again.");
    }
}


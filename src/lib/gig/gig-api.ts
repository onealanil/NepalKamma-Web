import { ErrorToast } from "@/components/ui/Toast";
import { GigI } from "@/types/gig";
import axiosInstance from "../axios";


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
    }
}


import { JobI } from "@/types/job";
import axiosInstance from "../axios";
import { ErrorToast } from "@/components/ui/Toast";

/**
 * 
 * @function createJob
 * @description this function helps to create the job
 * @param job: Job data
 * @returns Response from the server
 * @route POST /job/createJob
*/

export async function createJob(job: JobI) {
    try {
        const response = await axiosInstance.post(`/job/createJob`, job);
        return response.data;
    }
    catch (error: unknown) {
        ErrorToast("Something Went wrong while creating jobs!");
    }
}

/**
 * 
 * @function fetchUserJobs
 * @description this function helps to fetch the user jobs
 * @param userId: User ID
 * @returns Response from the server
 * @route GET /job/getSingleUserJob/:userId
*/
export async function fetchUserJobs(userId: string) {
    try {
        const response = await axiosInstance.get(`/job/getSingleUserJob/${userId}`);
        return response.data;
    }
    catch (error: unknown) {
        ErrorToast("Something Went wrong while fetching user jobs!");
    }
}

/**
 * 
 * @function deleteJob
 * @description this function helps to delete the job
 * @param jobId: Job ID
 * @returns Response from the server
 * @route DELETE /job/deleteJob/:jobId
*/
export async function deleteJob(jobId: string) {
    try {
        const response = await axiosInstance.delete(`/job/deleteJob/${jobId}`);
        return response.data;
    }
    catch (error: unknown) {
        ErrorToast("Something Went wrong while deleting the job!");
    }
}

/**
 * @function updateJob
 * @description this function helps to update the job
 * @param jobId: Job ID
 * @param jobData: Updated job data
 * @returns Response from the server
 * @route PUT /job/updateJob/:jobId
 */

export async function updateJob(jobId: string, jobData: JobI) {
    try {
        const response = await axiosInstance.put(`/job/updateJobStatus/${jobId}`, jobData);
        return response.data;
    }
    catch (error: unknown) {
        ErrorToast("Something Went wrong while updating the job!");
    }
}

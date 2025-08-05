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


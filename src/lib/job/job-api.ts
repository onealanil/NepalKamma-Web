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
 * @returns 
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

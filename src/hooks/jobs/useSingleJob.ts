
import useSWR from "swr";
import { fetchJobById } from "@/lib/job/job-api";
import { JobI } from "@/types/job";

/**
 * @function useSingleJob
 * @param jobId - Job ID to fetch
 * @returns: {job: JobI | null, isLoading: boolean, isError: boolean, mutate: () => void}
 * @description: Hook for fetching a single job by ID
 */
export const useSingleJob = (jobId?: string) => {
    const key = jobId ? `/job/${jobId}` : null;

    const { data, error, isLoading, mutate: revalidate } = useSWR(
        key,
        async (): Promise<JobI | null> => {
            if (!jobId) return null;
            const response = await fetchJobById(jobId);
            // The API returns { success: true, data: { success: true, job: {...} } }
            // So we need to access response.data.job
            return response.success ? (response.data as { job: JobI }).job : null;
        },
        {
            revalidateOnFocus: false,
            refreshInterval: 0, // Don't auto-refresh job details
            errorRetryCount: 3,
            errorRetryInterval: 5000
        }
    );

    return {
        job: data || null,
        isLoading,
        isError: !!error,
        mutate: revalidate,
    };
};
